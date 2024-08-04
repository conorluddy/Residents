import { EXPIRATION_JWT_TOKEN, JWT_TOKEN_SECRET } from "../config"
import { User } from "../db/schema"
import jwt from "jsonwebtoken"

export const generateJwt = (userPayload: JWTUserPayload, expiryOverride?: string) => {
  const secret = JWT_TOKEN_SECRET
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
      expiresIn: expiryOverride ?? EXPIRATION_JWT_TOKEN,
    }
  )
}

export type JWTUserPayload = Partial<User>
