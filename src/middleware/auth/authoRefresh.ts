import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { JWT_TOKEN_SECRET, EXPIRATION_JWT_TOKEN } from "../../config"
import { REQUEST_VERIFIED_JWT } from "../../types/requestSymbols"
import { UnauthorizedError } from "../../errors"
import SERVICES from "../../services"
import { generateJwtFromUser } from "../../utils/generateJwt"
import { REFRESH_TOKEN, RESIDENT_TOKEN, XSRF_TOKEN } from "../../constants/keys"
import { REFRESH_TOKEN_EXPIRY } from "../../constants/crypt"
import generateXsrfToken from "../util/xsrfToken"
import { TOKEN_TYPE } from "../../constants/database"

// Refresh token threshold is 1 minute before expiry
const REFRESH_THRESHOLD = 0

export const authoRefresh = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) throw new UnauthorizedError("JWT token is not provided in the request headers.")

  // Decode the token without verification, we only wanna see if it's expired or nearly expired
  const exp = (jwt.decode(token) as JwtPayload)?.exp
  if (typeof exp !== "number") throw new UnauthorizedError("JWT token is invalid.")
  const expirationTime = exp * 1000
  const currentTime = Date.now()

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  console.log("AUTO REFRESH CHECK", { expirationTime, currentTime })
  console.log("Remaining", expirationTime - currentTime)

  // Ideally this will be the majority of requests, where we just pass through
  // Could set a "should refresh" flag here and use another MW to handle the refresh logic
  if (expirationTime > currentTime) return next()

  console.log("Expired, refreshing")

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Token is about to expire, attempt to refresh
  const refreshTokenId = req.cookies?.[REFRESH_TOKEN]
  const userId = req.cookies?.[RESIDENT_TOKEN]

  if (!refreshTokenId || !userId) throw new UnauthorizedError("No refresh token available. Please log in again.")

  const refreshToken = await SERVICES.getToken({ tokenId: refreshTokenId })

  if (refreshToken && refreshToken.userId === userId && !refreshToken.used && refreshToken.expiresAt > new Date()) {
    // Valid refresh token, generate new tokens
    const user = await SERVICES.getUserById(userId)
    if (!user) throw new UnauthorizedError("User not found.")

    const newAccessToken = generateJwtFromUser(user)

    const newRefreshTokenId = await SERVICES.createToken({
      userId: user.id,
      type: TOKEN_TYPE.REFRESH,
      expiry: REFRESH_TOKEN_EXPIRY,
    })

    // DRY up all this cookie stuff, we have it in 3 places now

    // Set new cookies
    res.cookie(REFRESH_TOKEN, newRefreshTokenId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRY,
    })

    const xsrfToken = generateXsrfToken()
    res.cookie(XSRF_TOKEN, xsrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRY,
    })

    // Update the authorization header with the new token
    req.headers["authorization"] = `Bearer ${newAccessToken}`

    // Delete the old refresh token
    await SERVICES.deleteToken({ tokenId: refreshToken.id })

    // Verify the new token and set the user in the request
    const newJwtDecoded = jwt.verify(newAccessToken, JWT_TOKEN_SECRET) as jwt.JwtPayload

    req[REQUEST_VERIFIED_JWT] = newJwtDecoded

    res.setHeader("X-Latest-Access-Token", newAccessToken)
  } else {
    throw new UnauthorizedError("No refresh token available. Please log in again.")
  }

  next()
}
