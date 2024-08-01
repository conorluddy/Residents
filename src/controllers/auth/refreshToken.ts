import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { tableTokens, User } from "../../db/schema"
import db from "../../db"
import { eq } from "drizzle-orm"
import { NewToken } from "../../db/types"
import { TOKEN_TYPE } from "../../constants/database"
import { TIMESPAN } from "../../constants/time"
import { generateJwt } from "../../utils/generateJwt"
import generateXsrfToken from "../../middleware/util/xsrfToken"
dotenv.config()

/**
 * POST: refreshToken
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const secret = process.env.JWT_TOKEN_SECRET

    if (!secret || secret === "") {
      // Probably do this on startup instead of every request
      logger.warn("JWT token secret is not defined in your environment variables")
      return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }

    const authHeader = req.headers["authorization"]
    const jwToken = authHeader && authHeader.split(" ")[1] // Bearer[ ]TOKEN...
    const refreshToken = req.body?.refreshToken

    if (!refreshToken) {
      logger.warn("Refresh token token was not provided in the request body")
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Refresh token is required" })
    }

    if (jwToken == null) {
      logger.warn("JWT token was not provided in the request headers")
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "JWT token is required" })
    }

    // JWT is likely expired, so we don't need to verify it, just get the user ID from it
    const jwtUserData = jwt.decode(jwToken)

    const tokenWithUser = await db.query.tableTokens.findFirst({
      where: eq(tableTokens.id, refreshToken),
      with: { user: true },
    })

    if (tokenWithUser && jwtUserData && tokenWithUser?.userId !== (jwtUserData as User).id) {
      logger.error(`Token user mismatch: ${tokenWithUser?.userId}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token not valid." })
    }

    if (!tokenWithUser) {
      logger.error(`Refresh token not found: ${refreshToken}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token not valid." })
    }

    if (tokenWithUser.used) {
      // We delete them after they're used, so this is redundant unless we wanna keep them
      logger.error(`Attempt to use a used refresh token for ${tokenWithUser.user.email}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token not valid." })
    }

    if (tokenWithUser.expiresAt < new Date()) {
      logger.error(`Attempt to use an expired refresh token: ${refreshToken}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token has expired." })
    }

    // Create new JWT and RefreshToken and return them
    // Delete old RefreshToken
    const newRefreshToken: NewToken = {
      userId: tokenWithUser.userId,
      type: TOKEN_TYPE.REFRESH,
      expiresAt: new Date(Date.now() + TIMESPAN.WEEK), // Make configurable
    }

    // New tokens, who dis?
    const [freshRefreshToken] = await db.insert(tableTokens).values(newRefreshToken).returning()
    const accessToken = generateJwt(tokenWithUser.user)
    const xsrfToken = generateXsrfToken()

    // Set the tokens in a HTTP-only secure cookies
    res.cookie("refreshToken", freshRefreshToken.id, {
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

    // Delete the old token...
    await db.delete(tableTokens).where(eq(tableTokens.id, tokenWithUser.id))

    return res.status(HTTP_SUCCESS.OK).json({ accessToken })
  } catch (error) {
    logger.error(error)

    console.log("error", error)

    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error refreshing access token." })
  }
}
