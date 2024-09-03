import "express"
import { JwtPayload } from "jsonwebtoken"
import { User, SafeUser, PublicUser, Token } from "../db/types"
import {
  REQUEST_USER,
  REQUEST_TOKEN,
  REQUEST_TOKEN_ID,
  REQUEST_EMAIL,
  REQUEST_DB,
  REQUEST_TARGET_USER,
  REQUEST_TARGET_USER_ID,
} from "../types/requestSymbols"

declare module "express-serve-static-core" {
  interface Request {
    // Symbols let us ensure that the key is unique
    // and won't clash with anything else
    [REQUEST_TOKEN_ID]?: string
    [REQUEST_TOKEN]?: Token | null
    [REQUEST_USER]?: SafeUser | null
    [REQUEST_TARGET_USER]?: SafeUser | null
    [REQUEST_TARGET_USER_ID]?: string
    [REQUEST_EMAIL]?: string | null
    [REQUEST_DB]: NodePgDatabase<Record<string, never>>
  }
}
