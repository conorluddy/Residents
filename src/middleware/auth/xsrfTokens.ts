import { NextFunction, Request, Response } from "express"
import { JWT_TOKEN_SECRET } from "../../config"
import { UnauthorizedError } from "../../errors"
import jwt from "jsonwebtoken"
import generateXsrfToken from "../util/xsrfToken"

const xsrfTokens = (req: Request, res: Response, next: NextFunction) => {
  // Return as early as possible, this will be called on most requests and only need apply to mutations
  if (req.method === "GET") return next()
  if (req.path === "/auth") return next()
  if (req.path === "/users/register") return next()
  if (process.env.NODE_ENV === "test") return next()

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
  const requestHeadersXsrfToken = req.cookies?.["xsrfToken"]

  if (!requestHeadersXsrfToken) {
    throw new UnauthorizedError("XSRF token is required.")
  } else {
    jwt.verify(String(requestHeadersXsrfToken), secret, (err, content) => {
      if (err) throw new UnauthorizedError("XSRF token is invalid.")
      next()
    })
  }
}

export default xsrfTokens
