import { NextFunction, Request, Response } from 'express'
import { isEmail } from 'validator'
import { TOKEN_TYPE } from '../../constants/database'
import { TIMESPAN } from '../../constants/time'
import { User } from '../../db/schema'
import { BadRequestError, ForbiddenError, LoginError } from '../../errors'
import generateXsrfToken from '../../middleware/util/xsrfToken'
import SERVICES from '../../services'
import { validateHash } from '../../utils/crypt'
import { generateJwtFromUser } from '../../utils/generateJwt'
import { REFRESH_TOKEN, XSRF_TOKEN, RESIDENT_TOKEN } from '../../constants/keys'
import { REFRESH_TOKEN_EXPIRY } from '../../constants/crypt'
import { handleSuccessResponse } from '../../middleware/util/successHandler'

/**
 * login
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = (req.body ?? {}) as Pick<User, 'username' | 'email' | 'password'>

  if (!username && !email) {
    throw new BadRequestError('Username or email is required')
  }

  if (!password) {
    throw new BadRequestError('Password is required')
  }

  if (email && !isEmail(email)) {
    throw new BadRequestError('Invalid email address')
  }

  const getUserByUsernameOrEmail = username ? SERVICES.getUserByUsername : SERVICES.getUserByEmail
  const user = await getUserByUsernameOrEmail(username ?? email)

  if (!user) {
    throw new LoginError('No user found for that username or email.')
  } // Should probably clear any existing auth here

  const passwordHash = await SERVICES.getUserPasswordHash(user.id)

  if (!passwordHash) {
    throw new LoginError('No password hash found for that username or email.')
  }

  if (!(await validateHash(password, passwordHash))) {
    throw new LoginError('Incorrect password.')
  }

  const refreshTokenId = await SERVICES.createToken({
    userId: user.id,
    type: TOKEN_TYPE.REFRESH,
    expiry: TIMESPAN.WEEK,
  })

  if (!refreshTokenId) {
    throw new ForbiddenError('Couldnt create refresh token.')
  }

  // Set the tokens in HTTP-only secure cookies

  // Set the tokens in HTTP-only secure cookies

  const accessToken = generateJwtFromUser(user)
  res.cookie(REFRESH_TOKEN, refreshTokenId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRY,
  })

  const xsrfToken = generateXsrfToken()
  res.cookie(XSRF_TOKEN, xsrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRY,
  })

  res.cookie(RESIDENT_TOKEN, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRY,
  })

  return handleSuccessResponse({ res, token: accessToken })
}
