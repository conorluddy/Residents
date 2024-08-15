import { NextFunction, Request, RequestHandler, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { logger } from "../../utils/logger"
import { eq } from "drizzle-orm"
import db from "../../db"
import { tableUsers, User } from "../../db/schema"
import { userToSafeUser } from "../../utils/user"
import { REQUEST_USER } from "../../types/requestSymbols"

/**
 * Middleware for finding a user by their email address.
 * Ensure that the email is validated before using this middleware.
 */
const findUserByValidEmail: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { validatedEmail } = req

    if (!validatedEmail) {
      logger.error(`Email not validated: ${validatedEmail}`)
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Invalid email" })
    }

    // Update these user queries to only return SafeUser objects in a data access layer rather than in the mw or controller
    const user = await db.query.tableUsers.findFirst({ where: eq(tableUsers.email, validatedEmail) })

    if (!user) {
      logger.error(`User not found: ${validatedEmail}`)
      // Don't reveal if the user exists or not, this is a public endpoint.
      return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "User not found" })
    }

    req[REQUEST_USER] = userToSafeUser(user)
    next()
  } catch (error) {
    logger.error("findUserByValidEmail error: ", error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error" })
  }
}

export default findUserByValidEmail
