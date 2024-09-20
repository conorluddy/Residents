import dotenv from 'dotenv'
import { logger } from './utils/logger'
import MESSAGES from './constants/messages'
dotenv.config()

const requiredEnvVars = [
  process.env.JWT_TOKEN_SECRET,
  process.env.EXPIRATION_JWT_TOKEN,
  process.env.EXPIRATION_REFRESH_TOKEN,
  process.env.EXPIRATION_XSRF_TOKEN,
  process.env.EXPIRATION_PASSWORD_RESET_TOKEN,
  process.env.EXPIRATION_MAGIC_LOGIN_TOKEN,
  process.env.SENDGRID_API_KEY,
  process.env.SENDGRID_VERIFIED_EMAIL,
  process.env.SENDGRID_TEST_EMAIL,
]

requiredEnvVars.forEach((_, index) => {
  if (!requiredEnvVars[index]) {
    // Codescan does not like us logging the names here, even though they're harmless
    logger.error(MESSAGES.MISSING_REQUIRED_ENV_VARS)
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1)
    }
  }
})

const config: Config = {
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET!,

  // Tokens
  EXPIRATION_JWT_TOKEN: process.env.EXPIRATION_JWT_TOKEN!,
  EXPIRATION_REFRESH_TOKEN: process.env.EXPIRATION_REFRESH_TOKEN!,
  EXPIRATION_XSRF_TOKEN: process.env.EXPIRATION_XSRF_TOKEN!,
  EXPIRATION_PASSWORD_RESET_TOKEN: process.env.EXPIRATION_PASSWORD_RESET_TOKEN!,
  EXPIRATION_MAGIC_LOGIN_TOKEN: process.env.EXPIRATION_MAGIC_LOGIN_TOKEN!,

  // Sendgrid
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY!,
  SENDGRID_VERIFIED_EMAIL: process.env.SENDGRID_VERIFIED_EMAIL!,
  SENDGRID_TEST_EMAIL: process.env.SENDGRID_TEST_EMAIL!,
}

export const {
  JWT_TOKEN_SECRET,
  EXPIRATION_JWT_TOKEN,
  EXPIRATION_REFRESH_TOKEN,
  EXPIRATION_XSRF_TOKEN,
  EXPIRATION_PASSWORD_RESET_TOKEN,
  EXPIRATION_MAGIC_LOGIN_TOKEN,
  SENDGRID_API_KEY,
  SENDGRID_VERIFIED_EMAIL,
  SENDGRID_TEST_EMAIL,
} = config

export default config

interface Config {
  JWT_TOKEN_SECRET: string
  EXPIRATION_JWT_TOKEN: string
  EXPIRATION_REFRESH_TOKEN: string
  EXPIRATION_XSRF_TOKEN: string
  EXPIRATION_PASSWORD_RESET_TOKEN: string
  EXPIRATION_MAGIC_LOGIN_TOKEN: string
  SENDGRID_API_KEY: string
  SENDGRID_VERIFIED_EMAIL: string
  SENDGRID_TEST_EMAIL: string
}
