import { NextFunction, Request, Response } from "express"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import { TIMESPAN } from "../../constants/time"
import { ForbiddenError, TokenError } from "../../errors"
import generateXsrfToken from "../../middleware/util/xsrfToken"
import SERVICES from "../../services"
import { generateJwtFromUser } from "../../utils/generateJwt"

const TOKEN_EXPIRY = TIMESPAN.WEEK
const REFRESH_TOKEN = "refreshToken"
const XSRF_TOKEN = "xsrfToken"
const RESIDENT_TOKEN = "residentToken"

/**
 * POST: refreshToken
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const refreshTokenId = req.cookies?.[REFRESH_TOKEN]
  const userId = req.cookies?.[RESIDENT_TOKEN]

  if (!refreshTokenId) throw new TokenError("Refresh token is required")
  if (!userId) throw new TokenError("Refresh token counterpart is required")

  // Get the refresh token from the DB if it exists
  const token = await SERVICES.getToken({ tokenId: refreshTokenId })

  // Regardless of the token state, clear them once we've fetched it
  await SERVICES.deleteRefreshTokensByUserId({ userId })

  if (!token) {
    throw new ForbiddenError("Token not found.")
  }
  if (token && userId && token?.userId !== userId) {
    throw new ForbiddenError("Token user not valid.")
  }
  if (token.used) {
    throw new ForbiddenError("Token has already been used.")
  }
  if (token.expiresAt < new Date()) {
    throw new ForbiddenError("Token has expired.")
  }

  // Create new JWT and RefreshToken and return them
  const freshRefreshTokenId = await SERVICES.createToken({
    userId: token.userId,
    type: TOKEN_TYPE.REFRESH,
    expiry: TIMESPAN.WEEK,
  })

  if (!freshRefreshTokenId) throw new ForbiddenError("Error creating refresh token.")

  const user = await SERVICES.getUserById(userId)

  if (!user) throw new ForbiddenError("User not found.")

  // Set the tokens in a HTTP-only secure cookies
  const accessToken = generateJwtFromUser(user)
  res.cookie(REFRESH_TOKEN, freshRefreshTokenId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: TOKEN_EXPIRY,
  })

  const xsrfToken = generateXsrfToken()
  res.cookie(XSRF_TOKEN, xsrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: TOKEN_EXPIRY,
  })

  const userIdToken = userId
  res.cookie(RESIDENT_TOKEN, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: TOKEN_EXPIRY,
  })

  userId

  await SERVICES.deleteToken({ tokenId: token.id })

  return res.status(HTTP_SUCCESS.OK).json({ accessToken })
}
