import jwt from "jsonwebtoken"
import TYPEGUARD from "../../types/typeguards"
import { Request, Response, NextFunction } from "express"
import { JWT_TOKEN_SECRET } from "../../config"
import { REQUEST_USER, REQUEST_VERIFIED_JWT } from "../../types/requestSymbols"
import { InternalServerError, UnauthorizedError } from "../../errors"

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  const secret = JWT_TOKEN_SECRET

  if (!token) throw new UnauthorizedError("JWT token is not provided in the request headers.")

  if (!secret || secret === "")
    throw new InternalServerError("JWT token secret is not defined in your environment variables.")

  jwt.verify(token, secret, (err, jwtPayload) => {
    if (err) throw new UnauthorizedError("Token is invalid or expired.")
    if (!TYPEGUARD.isJwtUser(jwtPayload)) throw new UnauthorizedError("JWT contains invalid user data.")
    req[REQUEST_USER] = jwtPayload
    req[REQUEST_VERIFIED_JWT] = jwtPayload
    next()
  })
}
