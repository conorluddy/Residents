import "express"
import { JwtPayload } from "jsonwebtoken"
import { JWTUserPayload } from "../utils/generateJwt"
import { User } from "../db/types"

declare module "express-serve-static-core" {
  interface Request {
    db: NodePgDatabase<Record<string, never>>
    user?: JWTUserPayload | JwtPayload | string
    userNoPW?: User
    targetUserId?: string
    validatedEmail?: string
    validatedToken?: string
    tokenWithUser?: TokenWithUser
  }
}
