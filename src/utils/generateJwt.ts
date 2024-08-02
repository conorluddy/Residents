import { User } from "../db/schema"
import jwt from "jsonwebtoken"

const DEFAULT_JWT_TOKEN_EXPIRY = "1m"

export const generateJwt = (userPayload: JWTUserPayload, expiryOverride?: string) => {
  const secret = process.env.JWT_TOKEN_SECRET
  if (secret == null) throw new Error("JWT secret not found")

  return jwt.sign(
    {
      // Adjust this to have as little or as much user data as you need
      id: userPayload.id,
      firstName: userPayload.firstName,
      lastName: userPayload.lastName,
      username: userPayload.username,
      email: userPayload.email,
      role: userPayload.role,
      status: userPayload.status,
      deletedAt: userPayload.deletedAt,
    },
    secret,
    {
      expiresIn: expiryOverride ?? process.env.JWT_TOKEN_EXPIRY ?? DEFAULT_JWT_TOKEN_EXPIRY,
    }
  )
}

export type JWTUserPayload = Partial<User>
