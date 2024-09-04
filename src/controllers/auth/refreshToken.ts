import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import { TIMESPAN } from "../../constants/time"
import { PublicUser } from "../../db/types"
import { BadRequestError, ForbiddenError } from "../../errors"
import generateXsrfToken from "../../middleware/util/xsrfToken"
import SERVICES from "../../services"
import { generateJwtFromUser } from "../../utils/generateJwt"

/**
 * POST: refreshToken
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const jwToken = authHeader && authHeader.split(" ")[1] // Bearer[ ]TOKEN...
  const refreshTokenId = req.body?.refreshToken

  if (!refreshTokenId) throw new BadRequestError("Refresh token is required")

  if (jwToken == null) throw new BadRequestError("JWT token is required")

  // JWT is likely expired, so we don't need to verify it, just get the user ID from it
  const jwtUserIncoming = jwt.decode(jwToken) as PublicUser

  // Get the refresh token from the DB if it exists
  const token = await SERVICES.getToken({ tokenId: refreshTokenId })

  // Throw forbidden if the token is not valid or expired
  if (token && jwtUserIncoming && token?.userId !== jwtUserIncoming.id) throw new ForbiddenError("Token not valid.")
  if (!token) throw new ForbiddenError("Token not valid.")
  if (token.used) throw new ForbiddenError("Token not valid.")
  if (token.expiresAt < new Date()) throw new ForbiddenError("Token not valid.")

  // Create new JWT and RefreshToken and return them
  // TODO: Delete old RefreshToken
  const freshRefreshTokenId = await SERVICES.createToken({
    userId: token.userId,
    type: TOKEN_TYPE.REFRESH,
    expiry: TIMESPAN.WEEK,
  })

  if (!freshRefreshTokenId) throw new ForbiddenError("Error creating refresh token.")

  const user = await SERVICES.getUserById(jwtUserIncoming.id)

  if (!user) throw new ForbiddenError("User not found.")

  const accessToken = generateJwtFromUser(user)
  const xsrfToken = generateXsrfToken()

  // Set the tokens in a HTTP-only secure cookies
  res.cookie("refreshToken", freshRefreshTokenId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: TIMESPAN.WEEK,
  })

  res.cookie("xsrfToken", xsrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: TIMESPAN.WEEK,
  })

  await SERVICES.deleteToken({ tokenId: token.id })

  return res.status(HTTP_SUCCESS.OK).json({ accessToken })
}
