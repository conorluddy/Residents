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
    const refreshToken = req.cookies["refreshToken"]
    const jwToken = req.headers["authorization"]?.split(" ")[1]

    if (refreshToken == null) {
      logger.warn("Refresh token token is not provided in the request headers")
      return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "Refresh token is required" })
    }

    if (jwToken == null) {
      logger.warn("JWT token is not provided in the request headers")
      return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "Token is required" })
    }

    if (!secret || secret === "") {
      logger.warn("JWT token secret is not defined in your environment variables")
      return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }

    const jwtUserData = jwt.decode(jwToken)

    const tokenWithUser = await db.query.tableTokens.findFirst({
      where: eq(tableTokens.id, refreshToken),
      with: { user: true },
    })

    if (tokenWithUser && jwtUserData && tokenWithUser?.userId !== (jwtUserData as User).id) {
      logger.error(`Token user mismatch: ${tokenWithUser?.userId}`)
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Token not found." })
    }

    if (!tokenWithUser) {
      logger.error(`Refresh token not found: ${refreshToken}`)
      return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: "Token not found." })
    }

    if (tokenWithUser.used) {
      logger.error(`Attempt to use a used refresh token: ${refreshToken}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token has already been used." })
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
      expiresAt: new Date(Date.now() + TIMESPAN.WEEK), // TODO: Make configurable
    }

    // New tokens, who dis?
    const [freshRefreshToken] = await db.insert(tableTokens).values(newRefreshToken).returning()
    const accessToken = generateJwt(tokenWithUser.user)
    const xsrfToken = generateXsrfToken()

    // Set the tokens in a HTTP-only secure cookies
    res.cookie("refreshToken", refreshToken.id, {
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

    return res.status(HTTP_SUCCESS.OK).json({ accessToken })

    // return res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).json({ message: "Not implemented yet" })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error registering user" })
  }
}
