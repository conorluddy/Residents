import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Request, Response, NextFunction } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../constants/http"
import { logger } from "../utils/logger"

dotenv.config()

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Bearer[ ]TOKEN...
  const secret = process.env.JWT_TOKEN_SECRET

  if (token == null) {
    logger.warn("JWT token is not provided in the request headers")
    return res.sendStatus(HTTP_CLIENT_ERROR.UNAUTHORIZED)
  }

  if (secret == null) {
    logger.warn("JWT token secret is not defined in your environment variables")
    return res.sendStatus(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      logger.warn("JWT token is invalid or expired")
      return res.sendStatus(HTTP_CLIENT_ERROR.FORBIDDEN)
    }
    req.user = user
    next()
  })
}
