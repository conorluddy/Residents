import "express"
import { JwtPayload } from "jsonwebtoken"
import { JWTUserPayload } from "../utils/jwt"

declare module "express-serve-static-core" {
  interface Request {
    db: NodePgDatabase<Record<string, never>>
    user: JWTUserPayload | JwtPayload | string | undefined
  }
}
