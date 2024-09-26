import 'express'
import { Request as ExpressRequest } from 'express'
import { SafeUser, Token } from '../db/types'
import {
  REQUEST_USER,
  REQUEST_TOKEN,
  REQUEST_TOKEN_ID,
  REQUEST_EMAIL,
  REQUEST_DB,
  REQUEST_TARGET_USER,
  REQUEST_TARGET_USER_ID,
} from '../types/requestSymbols'

declare module 'express-serve-static-core' {
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

declare const process: {
  env: Record<string, string | undefined>
}

/// Move these to index.ts - index.d should only be for type declarations
export interface ResidentRequest extends ExpressRequest {
  [REQUEST_TOKEN_ID]?: string
  [REQUEST_TOKEN]?: Token | null
  [REQUEST_USER]?: SafeUser | null
  [REQUEST_TARGET_USER]?: SafeUser | null
  [REQUEST_TARGET_USER_ID]?: string
  [REQUEST_EMAIL]?: string | null
  [REQUEST_DB]: NodePgDatabase<Record<string, never>>
}

export interface ResidentResponse {
  data?: Record<string, unknown>
  message?: string
  error?: string
}

export interface SendGridError {
  message: string
  code: number
  response: {
    headers: {
      server: string
      date: string
      'content-type': string
      'content-length': string
      connection: string
      'access-control-allow-origin': string
      'access-control-allow-methods': string
      'access-control-allow-headers': string
      'access-control-max-age': string
      'x-no-cors-reason': string
      'strict-transport-security': string
    }
    body: {
      errors: Array<{
        message: string
        field: string
        help: string
      }>
    }
  }
}
