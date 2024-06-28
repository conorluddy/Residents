import { User } from "../db/schema"
import jwt from "jsonwebtoken"

const DEFAULT_JWT_TOKEN_EXPIRY = "1m"

export const generateJwt = (userPayload: JWTUserPayload) => {
  const secret = process.env.JWT_TOKEN_SECRET
  if (secret == null) throw new Error("JWT secret not found")

  return jwt.sign(userPayload, secret, {
    expiresIn: process.env.JWT_TOKEN_EXPIRY ?? DEFAULT_JWT_TOKEN_EXPIRY,
  })
}

export type JWTUserPayload = Pick<User, "id" | "firstName" | "lastName" | "email" | "username" | "role">
