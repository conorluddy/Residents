import { NextFunction, Request, RequestHandler, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../constants/http"
import { logger } from "../utils/logger"
import { eq } from "drizzle-orm"
import db from "../db"
import { tableUsers } from "../db/schema"

/**
 * Middleware for finding a user by their email address.
 * Ensure that the email is validated before using this middleware.
 */
const findUserByValidEmail: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { validatedEmail } = req

    if (!validatedEmail) {
      logger.error(`Email not validated: ${validatedEmail}`)
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).send("Invalid email")
    }

    const user = await db.query.tableUsers.findFirst({ where: eq(tableUsers.email, validatedEmail) })

    if (!user) {
      logger.error(`User not found: ${validatedEmail}`)
      // Don't reveal if the user exists or not, this is a public endpoint.
      return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).send("User not found")
    }

    req.userNoPW = { ...user, password: null }
    next()
  } catch (error) {
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error")
  }
}

export default findUserByValidEmail
