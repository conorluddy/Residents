import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { logger } from "../../utils/logger"
import { isEmail } from "validator"
import { eq } from "drizzle-orm"
import db from "../../db"
import { tableUsers } from "../../db/schema"
import { User } from "../../db/types"

/**
 * resetPassword
 * This controller is responsible for instigating the password reset process.
 * As a user won't be logged in, we'll need to take their email address
 * and send them a reset link with a token that will be used to verify their identity.
 *
 *
 * POST
 */
export const resetPassword = async ({ body }: Request, res: Response) => {
  try {
    const { email, username } = body

    if (!email) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).send("Email is required")
    }

    if (!isEmail(email)) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).send("Invalid email address")
    }

    const users: User[] = (await db.select().from(tableUsers).where(eq(tableUsers.email, email))) ?? []
    const user = users[0]

    console.log("user email: ", user.email)

    return res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).send("Not implemented yet")
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error resetting password")
  }
}
