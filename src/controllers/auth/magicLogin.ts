import { Request, Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { BadRequestError } from '../../errors'
import { REQUEST_EMAIL } from '../../types/requestSymbols'
import SERVICES from '../../services'
import { TOKEN_TYPE } from '../../constants/database'
import { TIMESPAN } from '../../constants/time'
import { sendMail } from '../../mail/sendgrid'
import { SENDGRID_TEST_EMAIL } from '../../config'
import { logger } from '../../utils/logger'

/**
 * magicLogin
 */
export const magicLogin = async (req: Request, res: Response): Promise<Response> => {
  // Email will be added to the request from the previous email validation middleware
  const email = req[REQUEST_EMAIL]
  if (!email) {
    throw new BadRequestError('User data missing.')
  }

  let debugTokenId

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

    sendMail({
      to: SENDGRID_TEST_EMAIL ?? '', //userNoPW.email, - Faker might seed with real emails, be careful not to spam people
      subject: 'Magic login link',
      body: `Magic link - Click to magically log in: http://localhost:3000/auth/magic-login/${tokenId}`,
      // Obviously this is a test link, in production you'd want to use a real domain
    })

    logger.info(`Magic login email sent to ${email}, token id: ${tokenId}`)
    debugTokenId = tokenId
  }

  return res.status(HTTP_SUCCESS.OK).json({
    message: CHECK_EMAIL_MAGIC_LINK,
    debug: `http://localhost:3000/auth/magic-login/${debugTokenId}`, // TODO: Remove
  })
}
