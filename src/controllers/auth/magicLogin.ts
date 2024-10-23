import { Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { BadRequestError } from '../../errors'
import { REQUEST_EMAIL } from '../../types/requestSymbols'
import SERVICES from '../../services'
import { TOKEN_TYPE } from '../../constants/database'
import { TIMESPAN } from '../../constants/time'
import { sendMail } from '../../mail/sendgrid'
import { SENDGRID_TEST_EMAIL } from '../../config'
import { logger } from '../../utils/logger'
import MESSAGES from '../../constants/messages'
import { ResidentRequest, ResidentResponse } from '../../types'

/**
 * magicLogin
 */
export const magicLogin = async (req: ResidentRequest, res: Response<ResidentResponse>): Promise<void> => {
  // Email will be added to the request from the previous email validation middleware
  const email = req[REQUEST_EMAIL]
  if (!email) {
    throw new BadRequestError(MESSAGES.EMAIL_REQUIRED)
  }

  const user = await SERVICES.getUserByEmail(email)

  // Only set up token and send email if the user exists,
  // but this endpoint does not require auth, so we don't
  // disclose whether or not the email exists in the system.
  if (user) {
    await SERVICES.deleteMagicTokensByUserId({ userId: user.id }) // Clean as you go

    const tokenId = await SERVICES.createToken({
      userId: user.id,
      type: TOKEN_TYPE.MAGIC,
      expiry: TIMESPAN.MINUTE * 10, // Make configurable
    })

    // Needs to be set to user.email for real use
    const userEmail = SENDGRID_TEST_EMAIL ?? ''

    sendMail({
      to: userEmail, //userNoPW.email, - Faker might seed with real emails, be careful not to spam people
      subject: MESSAGES.MAGIC_LOGIN_LINK_MESSAGE,
      body: `Magic link - Click to magically log in: http://localhost:3000/auth/magic-login/${tokenId}`,
      // Obviously this is a test link, in production you'd want to use a real domain
    })

    logger.info(`${MESSAGES.MAGIC_LOGIN_EMAIL_SENT} ${email}, token id: ${tokenId}`)
  }

  // Bad actors are not told whether or not the email exists in the system.

  res.status(HTTP_SUCCESS.OK).json({
    message: MESSAGES.CHECK_EMAIL_MAGIC_LINK,
    // debug: `http://localhost:3000/auth/magic-login/${debugTokenId}`, // TODO: Remove
  })
}
