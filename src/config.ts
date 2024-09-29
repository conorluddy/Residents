import dotenv from 'dotenv'
import { logger } from './utils/logger'
import MESSAGES from './constants/messages'
import { timeToMs } from './utils/time'
dotenv.config()

// TODO: This can all be cleaned up and split out a bit better

const requiredEnvVars = [
  // Postgres
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  process.env.POSTGRES_URL,
  process.env.POSTGRES_PORT,

  // JWT
  process.env.JWT_TOKEN_SECRET,
  process.env.EXPIRATION_JWT_TOKEN,

  // Expirations
  process.env.EXPIRATION_XSRF_TOKEN,
  process.env.EXPIRATION_REFRESH_TOKEN,
  process.env.EXPIRATION_PASSWORD_RESET_TOKEN,
  process.env.EXPIRATION_MAGIC_LOGIN_TOKEN,
  process.env.EXPIRATION_VALIDATION_TOKEN,

  // Sendgrid
  // process.env.SENDGRID_API_KEY,
  // process.env.SENDGRID_VERIFIED_EMAIL,
  // process.env.SENDGRID_TEST_EMAIL,
]

/**
 * App won't start without the required vars
 */
requiredEnvVars.forEach((_, index) => {
  if (!requiredEnvVars[index]) {
    // Codescan does not like us logging the names here, even though they're harmless
    logger.error(`${MESSAGES.MISSING_REQUIRED_ENV_VARS} ${requiredEnvVars[index]} ${index}`)
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1)
    }
  }
})

const config: Config = {
  // Owner

  SEEDED_OWNER_FIRSTNAME: process.env.SEEDED_OWNER_FIRSTNAME,
  SEEDED_OWNER_LASTNAME: process.env.SEEDED_OWNER_LASTNAME,
  SEEDED_OWNER_EMAIL: process.env.SEEDED_OWNER_EMAIL,
  SEEDED_OWNER_USERNAME: process.env.SEEDED_OWNER_USERNAME,
  SEEDED_OWNER_PASSWORD: process.env.SEEDED_OWNER_PASSWORD,

  // Database

  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_URL: process.env.POSTGRES_URL,
  POSTGRES_PORT: process.env.POSTGRES_PORT,

  // Network

  TRUST_PROXY_NUMBER: process.env.TRUST_PROXY_NUMBER, // https://express-rate-limit.mintlify.app/guides/troubleshooting-proxy-issues#the-global-limiter-problem

  // Tokens

  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
  EXPIRATION_JWT_TOKEN: process.env.EXPIRATION_JWT_TOKEN,
  EXPIRATION_REFRESH_TOKEN: process.env.EXPIRATION_REFRESH_TOKEN,
  EXPIRATION_XSRF_TOKEN: process.env.EXPIRATION_XSRF_TOKEN,
  EXPIRATION_PASSWORD_RESET_TOKEN: process.env.EXPIRATION_PASSWORD_RESET_TOKEN,
  EXPIRATION_MAGIC_LOGIN_TOKEN: process.env.EXPIRATION_MAGIC_LOGIN_TOKEN,
  EXPIRATION_VALIDATION_TOKEN: process.env.EXPIRATION_VALIDATION_TOKEN,

  // Token Expirations in Milliseconds

  EXPIRATION_JWT_TOKEN_MS: timeToMs(process.env.EXPIRATION_JWT_TOKEN ?? '1m'),
  EXPIRATION_REFRESH_TOKEN_MS: timeToMs(process.env.EXPIRATION_REFRESH_TOKEN ?? '1m'),
  EXPIRATION_XSRF_TOKEN_MS: timeToMs(process.env.EXPIRATION_XSRF_TOKEN ?? '1m'),
  EXPIRATION_PASSWORD_RESET_TOKEN_MS: timeToMs(process.env.EXPIRATION_PASSWORD_RESET_TOKEN ?? '1m'),
  EXPIRATION_MAGIC_LOGIN_TOKEN_MS: timeToMs(process.env.EXPIRATION_MAGIC_LOGIN_TOKEN ?? '1m'),
  EXPIRATION_VALIDATION_TOKEN_MS: timeToMs(process.env.EXPIRATION_VALIDATION_TOKEN ?? '1m'),

  // Sendgrid

  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_VERIFIED_EMAIL: process.env.SENDGRID_VERIFIED_EMAIL,
  SENDGRID_TEST_EMAIL: process.env.SENDGRID_TEST_EMAIL,
}

export const {
  SEEDED_OWNER_FIRSTNAME,
  SEEDED_OWNER_LASTNAME,
  SEEDED_OWNER_EMAIL,
  SEEDED_OWNER_USERNAME,
  SEEDED_OWNER_PASSWORD,

  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_URL,
  POSTGRES_PORT,

  TRUST_PROXY_NUMBER,
  JWT_TOKEN_SECRET,

  EXPIRATION_JWT_TOKEN,
  EXPIRATION_REFRESH_TOKEN,
  EXPIRATION_XSRF_TOKEN,
  EXPIRATION_PASSWORD_RESET_TOKEN,
  EXPIRATION_MAGIC_LOGIN_TOKEN,
  EXPIRATION_VALIDATION_TOKEN,
  EXPIRATION_JWT_TOKEN_MS,
  EXPIRATION_REFRESH_TOKEN_MS,
  EXPIRATION_XSRF_TOKEN_MS,
  EXPIRATION_PASSWORD_RESET_TOKEN_MS,
  EXPIRATION_MAGIC_LOGIN_TOKEN_MS,
  EXPIRATION_VALIDATION_TOKEN_MS,

  SENDGRID_API_KEY,
  SENDGRID_VERIFIED_EMAIL,
  SENDGRID_TEST_EMAIL,
} = config

export default config

interface Config {
  SEEDED_OWNER_FIRSTNAME?: string
  SEEDED_OWNER_LASTNAME?: string
  SEEDED_OWNER_EMAIL?: string
  SEEDED_OWNER_USERNAME?: string
  SEEDED_OWNER_PASSWORD?: string
  POSTGRES_DB?: string
  POSTGRES_USER?: string
  POSTGRES_PASSWORD?: string
  POSTGRES_URL?: string
  POSTGRES_PORT?: string
  TRUST_PROXY_NUMBER?: string
  JWT_TOKEN_SECRET?: string
  EXPIRATION_JWT_TOKEN?: string
  EXPIRATION_REFRESH_TOKEN?: string
  EXPIRATION_XSRF_TOKEN?: string
  EXPIRATION_PASSWORD_RESET_TOKEN?: string
  EXPIRATION_MAGIC_LOGIN_TOKEN?: string
  EXPIRATION_VALIDATION_TOKEN?: string
  EXPIRATION_JWT_TOKEN_MS?: number
  EXPIRATION_REFRESH_TOKEN_MS?: number
  EXPIRATION_XSRF_TOKEN_MS?: number
  EXPIRATION_PASSWORD_RESET_TOKEN_MS?: number
  EXPIRATION_MAGIC_LOGIN_TOKEN_MS?: number
  EXPIRATION_VALIDATION_TOKEN_MS?: number
  SENDGRID_API_KEY?: string
  SENDGRID_VERIFIED_EMAIL?: string
  SENDGRID_TEST_EMAIL?: string
}
