import { NextFunction, Request, RequestHandler, Response } from "express"
import { HTTP_SERVER_ERROR } from "../../constants/http"
import SERVICES from "../../services"
import { REQUEST_EMAIL, REQUEST_USER } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"
import { BadRequestError } from "../../errors"

/**
 * Middleware for finding a user by their email address.
 * Best to ensure that the email is validated before using this middleware -
 * (req[REQUEST_EMAIL] should only ever have been set with a validated email)
 */
const findUserByValidEmail: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req[REQUEST_EMAIL]

    if (!email) throw new BadRequestError(`Email not valid: ${email}`)

    const user = await SERVICES.getUserByEmail(email)

    if (!user) throw new BadRequestError(`User not found: ${email}`)

    req[REQUEST_USER] = user
    next()
  } catch (error) {
    logger.error("findUserByValidEmail error: ", error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error finding user." })
  }
}

export default findUserByValidEmail
