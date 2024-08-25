import { Request, Response } from "express"
import { SENDGRID_TEST_EMAIL } from "../../config"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { TIMESPAN } from "../../constants/time"
import { sendMail } from "../../mail/sendgrid"
import { REQUEST_USER } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"
import SERVICES from "../../services"

/**
 * resetPassword
 * This controller is responsible for instigating the password reset process.
 * As a user won't be logged in, we'll need to take their email address
 * and send them a reset link with a token that will be used to verify their identity.
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { id, email } = req[REQUEST_USER] ?? {}
    if (!id || !email) {
      logger.error("ResetPassword controller: No user data.")
      return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "User data missing." })
    }

    const tokenId = await SERVICES.createToken({
      userId: id,
      type: TOKEN_TYPE.RESET,
      expiry: TIMESPAN.HOUR,
    })

    sendMail({
      to: SENDGRID_TEST_EMAIL ?? "", //userNoPW.email, - Faker might seed with real emails, be careful not to spam people
      subject: "Reset your password",
      body: `Click here to reset your password: http://localhost:3000/auth/reset-password/${tokenId}`,
      // Obviously this is a test link, in production you'd want to use a real domain
    })

    logger.info(`Reset email sent to ${email}, token id: ${tokenId}`)
    return res.status(HTTP_SUCCESS.OK).json({ message: "Reset email sent" })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Something went kaput." })
  }
}
