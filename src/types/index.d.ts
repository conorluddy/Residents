import "express"
import { JwtPayload } from "jsonwebtoken"
import { JWTUserPayload } from "../utils/generateJwt"

declare module "express-serve-static-core" {
  interface Request {
    db: NodePgDatabase<Record<string, never>>
    user: JWTUserPayload | JwtPayload | string | undefined
  }
}
