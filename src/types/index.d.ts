import "express"
import { JwtPayload } from "jsonwebtoken"
import { User, SafeUser } from "../db/types"
import { REQUEST_USER } from "../types/requestSymbols"

declare module "express-serve-static-core" {
  interface Request {
    // body: Record<string, string>
    // query: Record<string, string>
    // params: Record<string, string>

    db: NodePgDatabase<Record<string, never>>

    targetUserId?: string
    validatedEmail?: string
    validatedToken?: string

    // Get rid of this, user will have password
    tokenWithUser?: TokenWithUser

    // Symbols let us ensure that the key is unique
    // and won't clash with anything else
    [REQUEST_USER]?: SafeUser | null
  }
}
