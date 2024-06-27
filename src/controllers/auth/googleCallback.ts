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

    const token = generateJwt(req.user as JWTUserPayload)
    return res.status(HTTP_SUCCESS.OK).json({ token })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).send("Error logging in")
  }
}
