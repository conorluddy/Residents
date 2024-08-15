import jwt from "jsonwebtoken"
import { EXPIRATION_JWT_TOKEN, JWT_TOKEN_SECRET } from "../config"
import { PublicUser, SafeUser, User } from "../db/types"
import { userToPublicUser } from "./user"

export const generateJwt = (user: PublicUser | SafeUser | User, expiryOverride?: string) => {
  if (!JWT_TOKEN_SECRET) throw new Error("JWT secret not found")
  return jwt.sign(userToPublicUser(user), JWT_TOKEN_SECRET, { expiresIn: expiryOverride ?? EXPIRATION_JWT_TOKEN })
}
