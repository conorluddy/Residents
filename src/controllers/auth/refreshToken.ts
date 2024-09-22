import SERVICES from '../../services'
import generateXsrfToken from '../../middleware/util/xsrfToken'
import { Request, Response } from 'express'
import { TOKEN_TYPE } from '../../constants/database'
import { TIMESPAN } from '../../constants/time'
import { ForbiddenError, TokenError } from '../../errors'
import { generateJwtFromUser } from '../../utils/generateJwt'
import { REFRESH_TOKEN, RESIDENT_TOKEN, XSRF_TOKEN } from '../../constants/keys'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'
import { EXPIRATION_REFRESH_TOKEN_MS } from '../../config'

/**
 * POST: refreshToken
 *
 * Refreshes the access token using the refresh token.
 */
export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  const refreshTokenId = req.cookies?.[REFRESH_TOKEN]
  const userId = req.cookies?.[RESIDENT_TOKEN]

  if (!refreshTokenId) {
    throw new TokenError(MESSAGES.REFRESH_TOKEN_REQUIRED)
  }
  if (!userId) {
    throw new TokenError(MESSAGES.REFRESH_TOKEN_COUNTERPART_REQUIRED)
  }

  // Get the refresh token from the DB if it exists
  const token = await SERVICES.getToken({ tokenId: refreshTokenId })

  // Regardless of the token state, clear them once we've fetched it
  await SERVICES.deleteRefreshTokensByUserId({ userId })

  if (!token) {
    throw new ForbiddenError(MESSAGES.TOKEN_NOT_FOUND)
  }
  if (token && userId && token?.userId !== userId) {
    throw new ForbiddenError(MESSAGES.TOKEN_USER_INVALID)
  }
  if (token.used) {
    throw new ForbiddenError(MESSAGES.TOKEN_USED)
  }
  if (token.expiresAt < new Date()) {
    throw new ForbiddenError(MESSAGES.TOKEN_EXPIRED)
  }

  // Create new JWT and RefreshToken and return them
  const freshRefreshTokenId = await SERVICES.createToken({
    userId: token.userId,
    type: TOKEN_TYPE.REFRESH,
    expiry: TIMESPAN.WEEK,
  })

  if (!freshRefreshTokenId) {
    throw new ForbiddenError(MESSAGES.ERROR_CREATING_REFRESH_TOKEN)
  }

  const user = await SERVICES.getUserById(userId)

  if (!user) {
    throw new ForbiddenError(MESSAGES.USER_NOT_FOUND)
  }

  // Set the tokens in HTTP-only secure cookies

  const accessToken = generateJwtFromUser(user)
  res.cookie(REFRESH_TOKEN, freshRefreshTokenId, {
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

  res.cookie(RESIDENT_TOKEN, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: EXPIRATION_REFRESH_TOKEN_MS,
  })

  await SERVICES.deleteToken({ tokenId: token.id })

  return handleSuccessResponse({ res, token: accessToken })
}
