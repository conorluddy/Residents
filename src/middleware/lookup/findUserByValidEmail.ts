import { NextFunction, RequestHandler, Response } from 'express'
import SERVICES from '../../services'
import { REQUEST_EMAIL, REQUEST_USER } from '../../types/requestSymbols'
import { BadRequestError } from '../../errors'
import MESSAGES from '../../constants/messages'
import { isEmail } from 'validator'
import { ResidentRequest, ResidentResponse } from '../../types'

/**
 * Middleware for finding a user by their email address.
 * Ensure that the email is validated before using this middleware -
 * (req[REQUEST_EMAIL] should only ever have been set with a validated email)
 */
const findUserByValidEmail: RequestHandler = async (
  req: ResidentRequest,
  _res: Response<ResidentResponse>,
  next: NextFunction
) => {
  const email = req[REQUEST_EMAIL]

  if (!email) {
    throw new BadRequestError(MESSAGES.EMAIL_REQUIRED)
  }

  if (!isEmail(email)) {
    throw new BadRequestError(MESSAGES.INVALID_EMAIL)
  }

  const user = await SERVICES.getUserByEmail(email)

  if (!user) {
    throw new BadRequestError(MESSAGES.USER_NOT_FOUND)
  }

  req[REQUEST_USER] = user
  next()
}

export default findUserByValidEmail
