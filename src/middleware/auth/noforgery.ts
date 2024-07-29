import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Request, Response, NextFunction } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { logger } from "../../utils/logger"

dotenv.config()

const JWT_CSRF_TOKEN_EXPIRY = "1d" // Make me configurable - should probably match refresh token expiry

const generateCsrfToken = () => {
  const secret = process.env.JWT_TOKEN_SECRET
  if (secret == null) throw new Error("JWT secret not found")
  return jwt.sign({ CSRF_TOKEN: "🔒" }, secret, {
    expiresIn: JWT_CSRF_TOKEN_EXPIRY,
  })
}

const noforgery = (req: Request, res: Response, next: NextFunction) => {
  const secret = process.env.JWT_TOKEN_SECRET
  if (!secret) throw new Error("JWT secret not found")

  let csrfToken = req.cookies["XSRF-TOKEN"]

  if (!csrfToken) {
    csrfToken = generateCsrfToken()
    res.cookie("XSRF-TOKEN", csrfToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
  }

  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    const requestCsrfToken = req.headers["x-csrf-token"]
    try {
      if (!requestCsrfToken) throw new Error("No CSRF token provided")

      jwt.verify(String(requestCsrfToken), secret, (err, user) => {
        if (err) {
          logger.warn("JWT token is invalid or expired")
          return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "Token is invalid or expired" })
        }
        req.user = user
        next()
      })
    } catch (err) {
      return res.status(403).json({ message: "Invalid CSRF token" })
    }
  }

  next()
}

export default noforgery
