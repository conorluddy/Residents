import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Request, Response, NextFunction } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { logger } from "../../utils/logger"
dotenv.config()

const ROUTE_WHITELIST = ["/auth"]
const VERBS_BLACKLIST = ["POST", "PUT", "PATCH", "DELETE"]
const JWT_XSRF_TOKEN_EXPIRY = "1d" // Make me configurable - should probably match refresh token expiry

const generateXsrfToken = () => {
  const secret = process.env.JWT_TOKEN_SECRET
  if (secret == null) throw new Error("JWT secret not found")
  return jwt.sign({ XSRF_TOKEN: "🔒" }, secret, {
    expiresIn: JWT_XSRF_TOKEN_EXPIRY,
  })
}

const noforgery = (req: Request, res: Response, next: NextFunction) => {
  if (!VERBS_BLACKLIST.includes(req.method) || ROUTE_WHITELIST.includes(req.path)) {
    return next()
  }

  try {
    const secret = process.env.JWT_TOKEN_SECRET
    if (!secret) throw new Error("JWT secret not found")

    let xsrfToken = req.cookies["XSRF-TOKEN"]

    if (!xsrfToken) {
      xsrfToken = generateXsrfToken()
      res.cookie("XSRF-TOKEN", xsrfToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
    }

    const requestXsrfToken = req.headers["XSRF-TOKEN"]

    if (!requestXsrfToken) {
      throw new Error("XSRF token required.")
    } else {
      jwt.verify(String(requestXsrfToken), secret, (err, user) => {
        if (err) {
          logger.warn("JWT token is invalid or expired")
          return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "XSRF token is invalid or expired." })
        }
        req.user = user
        next()
      })
    }
  } catch (err) {
    return res.status(403).json({ message: "Invalid XSRF token." })
  }

  next()
}

export default noforgery
