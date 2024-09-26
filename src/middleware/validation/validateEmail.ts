import { NextFunction, RequestHandler, Response } from 'express'
import { isEmail } from 'validator'
import { REQUEST_EMAIL } from '../../types/requestSymbols'
import { BadRequestError } from '../../errors'
import { ResidentRequest, ResidentResponse } from '../../types'
import MESSAGES from '../../constants/messages'

const validateEmail: RequestHandler = (req: ResidentRequest, _res: Response<ResidentResponse>, next: NextFunction) => {
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
