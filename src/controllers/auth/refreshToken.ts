import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"
import jwt from "jsonwebtoken"
import { tableTokens, tableUsers, User } from "../../db/schema"
import db from "../../db"
import { eq } from "drizzle-orm"
import { NewToken, PublicUser } from "../../db/types"
import { TOKEN_TYPE } from "../../constants/database"
import { TIMESPAN } from "../../constants/time"
import { generateJwtFromUser } from "../../utils/generateJwt"
import generateXsrfToken from "../../middleware/util/xsrfToken"
import { viewUsers } from "../../db/schema/Users"

/**
 * POST: refreshToken
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
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
    const jwtPublicUserData = jwt.decode(jwToken) as PublicUser

    const token = await db.query.tableTokens.findFirst({
      where: eq(tableTokens.id, refreshToken),
    })

    if (token && jwtPublicUserData && token?.userId !== jwtPublicUserData.id) {
      logger.error(`Token x user mismatch: ${token?.userId}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token not valid." })
    }

    if (!token) {
      logger.error(`Refresh token not found: ${refreshToken}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token not valid." })
    }

    if (token.used) {
      // We delete them after they're used, so this is redundant unless we wanna keep them
      logger.error(`Attempt to use a used refresh token for USER${token.userId}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token not valid." })
    }

    if (token.expiresAt < new Date()) {
      logger.error(`Attempt to use an expired refresh token: ${refreshToken}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token has expired." })
    }

    // Create new JWT and RefreshToken and return them
    // Delete old RefreshToken
    const newRefreshToken: NewToken = {
      userId: token.userId,
      type: TOKEN_TYPE.REFRESH,
      expiresAt: new Date(Date.now() + TIMESPAN.WEEK), // Make configurable
    }

    // Move to a data access layer
    const [freshRefreshToken] = await db.insert(tableTokens).values(newRefreshToken).returning()
    const [user] = await db.select().from(viewUsers).where(eq(tableUsers.id, jwtPublicUserData.id))

    const accessToken = generateJwtFromUser(user)
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
    await db.delete(tableTokens).where(eq(tableTokens.id, token.id))

    return res.status(HTTP_SUCCESS.OK).json({ accessToken })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error refreshing access token." })
  }
}
