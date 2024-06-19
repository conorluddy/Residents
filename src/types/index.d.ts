import "express"
import { JwtPayload } from "jsonwebtoken"

declare module "express-serve-static-core" {
  interface Request {
    db: NodePgDatabase<Record<string, never>>
    user: JwtPayload | string | undefined
  }
}
