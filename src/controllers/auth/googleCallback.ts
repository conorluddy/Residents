import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"
import { generateJwt, JWTUserPayload } from "../../utils/generateJwt"

/**
 * googleCallback
 * GET
 */
export const googleCallback = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new Error("User not found")

    // TODO: Revalidate before returning token
    // This isn't secure, you can just fire a made up user at it in the request and get a token.
    // Probably need to check request for google related stuff and validate that the user is who they say they are.

    const token = generateJwt(req.user as JWTUserPayload)
    return res.status(HTTP_SUCCESS.OK).json({ token })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Error logging in" })
  }
}
