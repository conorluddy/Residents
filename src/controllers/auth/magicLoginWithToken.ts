import { NextFunction, Request, Response } from "express"
import SERVICES from "../../services"
import { REQUEST_TOKEN } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"
import { ForbiddenError } from "../../errors"
import { TOKEN_TYPE } from "../../constants/database"
import { TIMESPAN } from "../../constants/time"
import { REFRESH_TOKEN_EXPIRY } from "../../constants/crypt"
import { REFRESH_TOKEN, XSRF_TOKEN, RESIDENT_TOKEN } from "../../constants/keys"
import generateXsrfToken from "../../middleware/util/xsrfToken"
import { generateJwtFromUser } from "../../utils/generateJwt"
import { handleSuccessResponse } from "../../middleware/util/successHandler"

/**
 * GET: magicLoginWithToken
 */
export const magicLoginWithToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req[REQUEST_TOKEN]!

  const [user, _deletedTokenId] = await Promise.all([
    SERVICES.getUserById(token.userId),
    SERVICES.deleteToken({ tokenId: token.id }),
  ])

  if (!user) {throw new ForbiddenError('No user found for that token.')}

  logger.info(`Magic login by user: ${token.userId}`)

  const refreshTokenId = await SERVICES.createToken({
    userId: user.id,
    type: TOKEN_TYPE.REFRESH,
    expiry: TIMESPAN.WEEK,
  })

  if (!refreshTokenId) {throw new ForbiddenError('Couldnt create refresh token.')}

  // Set the tokens in HTTP-only secure cookies

  const jwt = generateJwtFromUser(user)
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

  const userIdToken = refreshTokenId
  res.cookie(RESIDENT_TOKEN, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRY,
  })

  return handleSuccessResponse({ res, token: jwt })
}
