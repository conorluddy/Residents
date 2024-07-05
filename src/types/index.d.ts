import "express"
import { JwtPayload } from "jsonwebtoken"
import { JWTUserPayload } from "../utils/generateJwt"
import { UserNoPW } from "../db/types"

declare module "express-serve-static-core" {
  interface Request {
    db: NodePgDatabase<Record<string, never>>
    user?: JWTUserPayload | JwtPayload | string
    userNoPW?: UserNoPW
    targetUserId?: string
    validatedEmail?: string
    validatedToken?: string
    tokenWithUser?: TokenWithUser
  }
}
