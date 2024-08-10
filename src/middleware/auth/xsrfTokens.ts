import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { logger } from "../../utils/logger"
import generateXsrfToken from "../util/xsrfToken"
import { JWT_TOKEN_SECRET } from "../../config"

const xsrfTokens = (req: Request, res: Response, next: NextFunction) => {
  // Return as early as possible, this will be called on most requests
  if (req.method === "GET") return next()
  if (req.path === "/auth") return next()
  if (req.path === "/users/register") return next()
  if (process.env.NODE_ENV === "test") return next()

  try {
    const secret = JWT_TOKEN_SECRET
    if (!secret) throw new Error("JWT secret not found")

    // Look for token in cookies, if not found, generate a new one
    let xsrfToken = req.cookies["xsrfToken"]
    if (!xsrfToken) {
      xsrfToken = generateXsrfToken()
      res.cookie("xsrfToken", xsrfToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
    }

    // XSRF-Token should actually be checked in the headers.
    // Client should take it from cookie and add it to headers.
    const requestHeadersXsrfToken = req.headers["xsrf-token"]

    if (!requestHeadersXsrfToken) {
      return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "XSRF token is required." })
    } else {
      jwt.verify(String(requestHeadersXsrfToken), secret, (err, user) => {
        if (err) {
          logger.warn("XSRF token is invalid.")
          return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: "XSRF token is invalid." })
        }
        req.user = user
        next()
      })
    }
  } catch (err) {
    logger.error("xsrfTokens MW error")
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error validating request." })
  }
}

export default xsrfTokens
