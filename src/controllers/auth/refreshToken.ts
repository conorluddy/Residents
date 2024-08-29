import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { TOKEN_TYPE } from "../../constants/database"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { TIMESPAN } from "../../constants/time"
import { PublicUser } from "../../db/types"
import generateXsrfToken from "../../middleware/util/xsrfToken"
import SERVICES from "../../services"
import { generateJwtFromUser } from "../../utils/generateJwt"
import { logger } from "../../utils/logger"
import { BadRequestError } from "../../errors"

/**
 * POST: refreshToken
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"]
    const jwToken = authHeader && authHeader.split(" ")[1] // Bearer[ ]TOKEN...
    const refreshTokenId = req.body?.refreshToken

    if (!refreshTokenId) {
      throw new BadRequestError("Refresh token was not provided.")
    }

    if (jwToken == null) {
      throw new BadRequestError("JWT was not provided.")
    }

    // JWT is likely expired, so we don't need to verify it, just get the user ID from it
    const jwtUserIncoming = jwt.decode(jwToken) as PublicUser

    // Get the refresh token from the DB if it exists
    const token = await SERVICES.getToken({ tokenId: refreshTokenId })

    if (token && jwtUserIncoming && token?.userId !== jwtUserIncoming.id) {
      logger.error(`Token x user mismatch: ${token?.userId}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token not valid." })
    }

    if (!token) {
      logger.error(`Refresh token not found: ${refreshTokenId}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token not valid." })
    }

    if (token.used) {
      // We delete them after they're used, so this is redundant unless we wanna keep them
      logger.error(`Attempt to use a used refresh token for USER${token.userId}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token not valid." })
    }

    if (token.expiresAt < new Date()) {
      logger.error(`Attempt to use an expired refresh token: ${refreshTokenId}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Token has expired." })
    }

    // Create new JWT and RefreshToken and return them
    // Delete old RefreshToken
    const freshRefreshTokenId = await SERVICES.createToken({
      userId: token.userId,
      type: TOKEN_TYPE.REFRESH,
      expiry: TIMESPAN.WEEK,
    })

    if (!freshRefreshTokenId) {
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Error creating refresh token." })
    }

    const user = await SERVICES.getUserByID(jwtUserIncoming.id)

    if (!user) {
      logger.error(`User not found for refreshtoken: ${refreshTokenId}`)
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "User not found." })
    }

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
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error refreshing access token." })
  }
}
