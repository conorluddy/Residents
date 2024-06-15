import { User } from "../db/schema"
import jwt from "jsonwebtoken"

const DEFAULT_JWT_TOKEN_EXPIRY = "1m"

export const generateJwt = (user: User) => {
  const secret = process.env.JWT_TOKEN_SECRET

  if (secret == null) throw new Error("JWT secret not found")

  return jwt.sign(user, secret, {
    expiresIn: process.env.JWT_TOKEN_EXPIRY ?? DEFAULT_JWT_TOKEN_EXPIRY,
  })
}
