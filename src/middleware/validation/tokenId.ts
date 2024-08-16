import { NextFunction, Request, RequestHandler, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { logger } from "../../utils/logger"
import { isCuid } from "@paralleldrive/cuid2"
import { REQUEST_TOKEN_ID } from "../../types/requestSymbols"

const validateTokenId: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenId: string | undefined = req.params?.token || req.body?.token || req.query?.token

    if (!tokenId) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "A token is required" })
    }

    if (!isCuid(tokenId)) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Invalid token provided" })
    }

    req[REQUEST_TOKEN_ID] = tokenId
    next()
  } catch (error) {
    logger.error("Token validation threw error: ", error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error validating token" })
  }
}

export default validateTokenId
