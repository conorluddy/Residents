import { Request, Response } from 'express'
import { SENDGRID_TEST_EMAIL } from '../../config'
import { TOKEN_TYPE } from '../../constants/database'
import { TIMESPAN } from '../../constants/time'
import { sendMail } from '../../mail/sendgrid'
import SERVICES from '../../services'
import { REQUEST_EMAIL } from '../../types/requestSymbols'
import { logger } from '../../utils/logger'
import { BadRequestError } from '../../errors'
import { handleSuccessResponse } from '../../middleware/util/successHandler'

/**
 * resetPassword
 * This controller is responsible for instigating the password reset process.
 * As a user won't be logged in, we'll need to take their email address
 * and send them a reset link with a token that will be used to verify their identity.
 * it is important to not disclose whether or not the email exists in the database.
 */
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  // Email will be added to the request from the previous email validation middleware
  const email = req[REQUEST_EMAIL]
  if (!email) {
    throw new BadRequestError('User data missing.')
  }

  const user = await SERVICES.getUserByEmail(email)

  // Only set up token and send email if the user exists,
  // but this endpoint does not require auth, so we don't
  // disclose whether or not the email exists in the system.
  if (user) {
    // TODO Delete older reset tokens before creating new one (see magic login)
    const tokenId = await SERVICES.createToken({
      userId: user.id,
      type: TOKEN_TYPE.RESET,
      expiry: TIMESPAN.HOUR,
    })
    sendMail({
      to: SENDGRID_TEST_EMAIL ?? '', //userNoPW.email, - Faker might seed with real emails, be careful not to spam people
      subject: 'Reset your password',
      body: `Click here to reset your password: http://localhost:3000/auth/reset-password/${tokenId}`,
      // Obviously this is a test link, in production you'd want to use a real domain
    })
    logger.info(`Reset email sent to ${email}, token id: ${tokenId}`)
  }

  return handleSuccessResponse({ res, message: CHECK_EMAIL_RESET_LINK })
}
