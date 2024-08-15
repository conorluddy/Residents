import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { logger } from "../../utils/logger"
import { JWT_TOKEN_SECRET } from "../../config"
import TYPEGUARD from "../../types/typeguards"
import { REQUEST_USER } from "../../types/requestSymbols"

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Bearer[ ]TOKEN...
  const secret = JWT_TOKEN_SECRET

  if (token == null) {
    logger.warn("JWT token is not provided in the request headers")
    return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "Token is required" })
  }

  if (!secret || secret === "") {
    logger.warn("JWT token secret is not defined in your environment variables")
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      logger.warn("JWT token is invalid or expired")
      return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "Token is invalid or expired" })
    }
    if (!TYPEGUARD.isSafeUser(user)) {
      logger.warn("JWT contains invalid user data:", JSON.stringify(user, null, 2))
      return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "Token is invalid" })
    }
    req[REQUEST_USER] = user
    next()
  })
}
