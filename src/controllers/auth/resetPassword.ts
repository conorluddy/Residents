import dotenv from "dotenv"
import { Request, Response } from "express"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import db from "../../db"
import { tableTokens } from "../../db/schema"
import { NewToken } from "../../db/types"
import { sendMail } from "../../mail/sendgrid"
import { logger } from "../../utils/logger"
dotenv.config()

/**
 * resetPassword
 * This controller is responsible for instigating the password reset process.
 * As a user won't be logged in, we'll need to take their email address
 * and send them a reset link with a token that will be used to verify their identity.
 *
 * POST
 */
export const resetPassword = async ({ userNoPW }: Request, res: Response) => {
  try {
    if (!userNoPW) {
      return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Something went wrong")
    }

    const newToken: NewToken = {
      user_id: userNoPW.id,
      type: TOKEN_TYPE.RESET,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24), // TODO: Make configurable
    }

    const tokens = await db.insert(tableTokens).values(newToken).returning() // see if we can get this to not return an array
    const tokenId = tokens[0]?.id

    sendMail({
      to: process.env.SENDGRID_TEST_EMAIL ?? "", //userNoPW.email, - Faker might seed with real emails, be careful not to spam people
      subject: "Reset your password",
      body: `Click here to reset your password: http://localhost:3000/reset/${tokenId}`,
    })

    logger.info(`Reset email sent to ${userNoPW.email}, token id: ${tokenId}`)
    return res.status(HTTP_SUCCESS.OK).send("Reset email sent")
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error resetting password")
  }
}
