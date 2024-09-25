import { NextFunction, RequestHandler, Response } from 'express'
import { isEmail } from 'validator'
import { REQUEST_EMAIL } from '../../types/requestSymbols'
import { BadRequestError } from '../../errors'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

const validateEmail: RequestHandler = (req: ResidentRequest, res: Response, next: NextFunction) => {
  const email: string | undefined = req.params?.email || req.body?.email || req.query?.email

  if (!email) {
    throw new BadRequestError(MESSAGES.EMAIL_REQUIRED)
  }
  if (!isEmail(email)) {
    throw new BadRequestError(MESSAGES.INVALID_EMAIL)
  }

  req[REQUEST_EMAIL] = email
  next()
}

export default validateEmail
