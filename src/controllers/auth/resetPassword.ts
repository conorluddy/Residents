import { Request, Response } from "express"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import db from "../../db"
import { tableTokens } from "../../db/schema"
import { NewToken } from "../../db/types"
import { sendMail } from "../../mail/sendgrid"
import { logger } from "../../utils/logger"
import { TIMESPAN } from "../../constants/time"
import { SENDGRID_TEST_EMAIL } from "../../config"
import { REQUEST_USER } from "../../types/requestSymbols"

/**
 * resetPassword
 * This controller is responsible for instigating the password reset process.
 * As a user won't be logged in, we'll need to take their email address
 * and send them a reset link with a token that will be used to verify their identity.
 *
 * POST
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    if (!req[REQUEST_USER]) {
      logger.error("ResetPassword controller: No user data.")
      return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "User data missing." })
    }

    const newToken: NewToken = {
      userId: req[REQUEST_USER]?.id,
      type: TOKEN_TYPE.RESET,
      expiresAt: new Date(Date.now() + TIMESPAN.HOUR), // TODO: Make configurable
    }

    const tokens = await db.insert(tableTokens).values(newToken).returning() // see if we can get this to not return an array
    const tokenId = tokens[0]?.id

    sendMail({
      to: SENDGRID_TEST_EMAIL ?? "", //userNoPW.email, - Faker might seed with real emails, be careful not to spam people
      subject: "Reset your password",
      body: `Click here to reset your password: http://localhost:3000/auth/reset-password/${tokenId}`,
      // Obviously this is a test link, in production you'd want to use a real domain
    })

    logger.info(`Reset email sent to ${req[REQUEST_USER].email}, token id: ${tokenId}`)
    return res.status(HTTP_SUCCESS.OK).json({ message: "Reset email sent" })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Something went kaput." })
  }
}
