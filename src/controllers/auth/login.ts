import { Request, Response } from 'express'
import { isEmail } from 'validator'
import { TOKEN_TYPE } from '../../constants/database'
import { User } from '../../db/schema'
import { BadRequestError, ForbiddenError, LoginError } from '../../errors'
import generateXsrfToken from '../../middleware/util/xsrfToken'
import SERVICES from '../../services'
import { validateHash } from '../../utils/crypt'
import { generateJwtFromUser } from '../../utils/generateJwt'
import { REFRESH_TOKEN, XSRF_TOKEN, RESIDENT_TOKEN } from '../../constants/keys'
import { EXPIRATION_REFRESH_TOKEN_MS } from '../../config'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'

/**
 * login
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username, email, password } = (req.body ?? {}) as Pick<User, 'username' | 'email' | 'password'>

  if (!username && !email) {
    throw new BadRequestError(MESSAGES.USERNAME_OR_EMAIL_REQUIRED)
  }

  if (!password) {
    throw new BadRequestError(MESSAGES.PASSWORD_REQUIRED)
  }

  if (email && !isEmail(email)) {
    throw new BadRequestError(MESSAGES.INVALID_EMAIL)
  }

  const getUserByUsernameOrEmail = username ? SERVICES.getUserByUsername : SERVICES.getUserByEmail
  const user = await getUserByUsernameOrEmail(username ?? email)

  if (!user) {
    throw new LoginError(MESSAGES.USER_NOT_FOUND)
  } // Should probably clear any existing auth here

  const passwordHash = await SERVICES.getUserPasswordHash(user.id)

  if (!passwordHash) {
    throw new LoginError(MESSAGES.NO_PASSWORD_HASH_FOUND)
  }

  if (!(await validateHash(password, passwordHash))) {
    throw new LoginError(MESSAGES.INCORRECT_PASSWORD)
  }

  const refreshTokenId = await SERVICES.createToken({
    userId: user.id,
    type: TOKEN_TYPE.REFRESH,
  })

  if (!refreshTokenId) {
    throw new ForbiddenError(MESSAGES.REFRESH_TOKEN_CREATION_FAILED)
  }

  // Set the tokens in HTTP-only secure cookies

  // Set the tokens in HTTP-only secure cookies

  const accessToken = generateJwtFromUser(user)
  res.cookie(REFRESH_TOKEN, refreshTokenId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: EXPIRATION_REFRESH_TOKEN_MS,
  })

  const xsrfToken = generateXsrfToken()
  res.cookie(XSRF_TOKEN, xsrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: EXPIRATION_REFRESH_TOKEN_MS,
  })

  res.cookie(RESIDENT_TOKEN, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: EXPIRATION_REFRESH_TOKEN_MS,
  })

  return handleSuccessResponse({ res, token: accessToken })
}
