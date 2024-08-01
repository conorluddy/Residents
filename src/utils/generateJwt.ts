import { User } from "../db/schema"
import jwt from "jsonwebtoken"

const DEFAULT_JWT_TOKEN_EXPIRY = "1m"

export const generateJwt = (userPayload: JWTUserPayload, expiryOverride?: string) => {
  const secret = process.env.JWT_TOKEN_SECRET
  if (secret == null) throw new Error("JWT secret not found")

  // MAke this util more explicit - "generateJwtForUser", and strip sensitive data.
  // Maybe just name, email, role etc

  return jwt.sign(userPayload, secret, {
    expiresIn: expiryOverride ?? process.env.JWT_TOKEN_EXPIRY ?? DEFAULT_JWT_TOKEN_EXPIRY,
  })
}

export type JWTUserPayload = Partial<User>
