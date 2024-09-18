import { NextFunction, Request, Response } from 'express'
import { TOKEN_TYPE } from '../../constants/database'
import { HTTP_SUCCESS } from '../../constants/http'
import { NewUser } from '../../db/types'
import { TIMESPAN } from '../../constants/time'
import { BadRequestError, EmailError } from '../../errors'
import SERVICES from '../../services'
import { isEmail } from 'validator'
import { handleCreatedResponse } from '../../middleware/util/successHandler'

// For dev - remove before flight
// import { SENDGRID_TEST_EMAIL } from "../../config"
// import { sendMail } from "../../mail/sendgrid"
// const SEND_EMAIL_TO_NEW_USERS = false

/**
 * createUser
 */
export const createUser = async ({ body }: Request, res: Response, next: NextFunction) => {
  const { username, firstName, lastName, email, password, role }: NewUser = body

  if (![username, firstName, lastName, email, password].every(Boolean)) {
    throw new BadRequestError('Missing required fields.')
  }

  if (email && !isEmail(email)) {
    throw new EmailError('Invalid email address')
  }

  const userId = await SERVICES.createUser({ username, firstName, lastName, email, password, role })

  if (!userId) {
    throw new BadRequestError('Error creating new user.')
  }

  await Promise.all([
    SERVICES.createUserMeta(userId),
    SERVICES.createToken({ userId, type: TOKEN_TYPE.VALIDATE, expiry: TIMESPAN.WEEK }),
  ])

  // if (SEND_EMAIL_TO_NEW_USERS) {
  //   await sendMail({
  //     to: SENDGRID_TEST_EMAIL ?? "", // Faker might seed with real emails, be careful not to spam people
  //     subject: "Validate your account",
  //     body: `Click here to validate your account: http://localhost:3000/auth/validate/${token.id}.${createdUser.id}`,
  //   })
  // }

  return handleCreatedResponse({ res, message: 'User registered.' })
}
