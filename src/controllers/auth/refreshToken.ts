import SERVICES from '../../services'
import generateXsrfToken from '../../middleware/util/xsrfToken'
import { NextFunction, Request, Response } from 'express'
import { TOKEN_TYPE } from '../../constants/database'
import { TIMESPAN } from '../../constants/time'
import { ForbiddenError, TokenError } from '../../errors'
import { generateJwtFromUser } from '../../utils/generateJwt'
import { REFRESH_TOKEN, RESIDENT_TOKEN, XSRF_TOKEN } from '../../constants/keys'
import { REFRESH_TOKEN_EXPIRY } from '../../constants/crypt'
import { handleSuccessResponse } from '../../middleware/util/successHandler'

/**
 * POST: refreshToken
 *
 * Refreshes the access token using the refresh token.
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshTokenId = req.cookies?.[REFRESH_TOKEN]
  const userId = req.cookies?.[RESIDENT_TOKEN]

  if (!refreshTokenId) {throw new TokenError('Refresh token is required.')}
  if (!userId) {throw new TokenError('Refresh token counterpart is required.')}

  // Get the refresh token from the DB if it exists
  const token = await SERVICES.getToken({ tokenId: refreshTokenId })

  // Regardless of the token state, clear them once we've fetched it
  await SERVICES.deleteRefreshTokensByUserId({ userId })

  if (!token) {
    throw new ForbiddenError('Token not found.')
  }
  if (token && userId && token?.userId !== userId) {
    throw new ForbiddenError('Token user not valid.')
  }
  if (token.used) {
    throw new ForbiddenError('Token has already been used.')
  }
  if (token.expiresAt < new Date()) {
    throw new ForbiddenError('Token has expired.')
  }

  // Create new JWT and RefreshToken and return them
  const freshRefreshTokenId = await SERVICES.createToken({
    userId: token.userId,
    type: TOKEN_TYPE.REFRESH,
    expiry: TIMESPAN.WEEK,
  })

  if (!freshRefreshTokenId) {throw new ForbiddenError('Error creating refresh token.')}

  const user = await SERVICES.getUserById(userId)

  if (!user) {throw new ForbiddenError('User not found.')}

  // Set the tokens in HTTP-only secure cookies

  const accessToken = generateJwtFromUser(user)
  res.cookie(REFRESH_TOKEN, freshRefreshTokenId, {
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

  res.cookie(RESIDENT_TOKEN, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRY,
  })

  await SERVICES.deleteToken({ tokenId: token.id })

  return handleSuccessResponse({ res, token: accessToken })
}
