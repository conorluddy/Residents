import dotenv from 'dotenv'
import { timeToMs } from '../src/utils/time'
dotenv.config()

// Mock process.env
process.env.JWT_TOKEN_SECRET = 'test-secret'
//
process.env.EXPIRATION_JWT_TOKEN = '1m'
process.env.EXPIRATION_REFRESH_TOKEN = '1m'
process.env.EXPIRATION_XSRF_TOKEN = '1m'
process.env.EXPIRATION_PASSWORD_RESET_TOKEN = '1m'
process.env.EXPIRATION_MAGIC_LOGIN_TOKEN = '1m'
//
process.env.SENDGRID_API_KEY = 'test-api-key'
process.env.SENDGRID_VERIFIED_EMAIL = 'verified@example.com'
process.env.SENDGRID_TEST_EMAIL = 'test@example.com'

jest.mock('../src/config', () => {
  return {
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
    EXPIRATION_JWT_TOKEN: process.env.EXPIRATION_JWT_TOKEN,
    EXPIRATION_REFRESH_TOKEN: process.env.EXPIRATION_JWT_TOKEN,
    EXPIRATION_XSRF_TOKEN: process.env.EXPIRATION_JWT_TOKEN,
    EXPIRATION_PASSWORD_RESET_TOKEN: process.env.EXPIRATION_JWT_TOKEN,
    EXPIRATION_MAGIC_LOGIN_TOKEN: process.env.EXPIRATION_JWT_TOKEN,
    EXPIRATION_VALIDATION_TOKEN: process.env.EXPIRATION_JWT_TOKEN,
    EXPIRATION_JWT_TOKEN_MS: timeToMs(process.env.EXPIRATION_JWT_TOKEN ?? '1m'),
    EXPIRATION_REFRESH_TOKEN_MS: timeToMs(process.env.EXPIRATION_JWT_TOKEN ?? '1m'),
    EXPIRATION_XSRF_TOKEN_MS: timeToMs(process.env.EXPIRATION_JWT_TOKEN ?? '1m'),
    EXPIRATION_PASSWORD_RESET_TOKEN_MS: timeToMs(process.env.EXPIRATION_JWT_TOKEN ?? '1m'),
    EXPIRATION_MAGIC_LOGIN_TOKEN_MS: timeToMs(process.env.EXPIRATION_JWT_TOKEN ?? '1m'),
    EXPIRATION_VALIDATION_TOKEN_MS: timeToMs(process.env.EXPIRATION_JWT_TOKEN ?? '1m'),
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_VERIFIED_EMAIL: process.env.SENDGRID_VERIFIED_EMAIL,
    SENDGRID_TEST_EMAIL: process.env.SENDGRID_TEST_EMAIL,
  }
})

jest.mock('../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}))
