import { NextFunction, Request, RequestHandler, Response } from 'express'
import { isEmail } from 'validator'
import { REQUEST_EMAIL } from '../../types/requestSymbols'
import { BadRequestError } from '../../errors'

const validateEmail: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const email: string | undefined = req.params?.email || req.body?.email || req.query?.email

  if (!email) {
    throw new BadRequestError('Email is required.')
  }
  if (!isEmail(email)) {
    throw new BadRequestError('Invalid email address.')
  }

  req[REQUEST_EMAIL] = email
  next()
}

export default validateEmail
