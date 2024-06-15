import "express"
import { User } from "../db/schema"
import { JwtPayload } from "jsonwebtoken"

// Customise the Express Request type to allow us attach a Drizzle instance
declare module "express-serve-static-core" {
  interface Request {
    db: NodePgDatabase<Record<string, never>>
    jwt: JwtPayload | string | undefined
  }
}
