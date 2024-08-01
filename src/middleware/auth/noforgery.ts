import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Request, Response, NextFunction } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { logger } from "../../utils/logger"
import generateXsrfToken from "../util/xsrfToken"
dotenv.config()

/**
 * Don't check these routes for XSRF token
 */
const ROUTE_WHITELIST = ["/auth", "/users/register"]
/**
 * Check these types of requests for XSRF token
 */
const VERBS_BLACKLIST = ["POST", "PUT", "PATCH", "DELETE"]

const noForgery = (req: Request, res: Response, next: NextFunction) => {
  if (!VERBS_BLACKLIST.includes(req.method) || ROUTE_WHITELIST.includes(req.path)) {
    return next()
  }

  try {
    const secret = process.env.JWT_TOKEN_SECRET
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
      throw new Error("XSRF token required.")
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
    console.error(err)
    return res.status(403).json({ message: "Invalid XSRF token." })
  }
}

export default noForgery
