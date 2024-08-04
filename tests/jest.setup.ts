import dotenv from "dotenv"
dotenv.config()

// Mock process.env
process.env.JWT_TOKEN_SECRET = "test-secret"
//
process.env.EXPIRATION_JWT_TOKEN = "1m"
process.env.EXPIRATION_REFRESH_TOKEN = "1m"
process.env.EXPIRATION_XSRF_TOKEN = "1m"
process.env.EXPIRATION_PASSWORD_RESET_TOKEN = "1m"
process.env.EXPIRATION_MAGIC_LOGIN_TOKEN = "1m"
//
process.env.SENDGRID_API_KEY = "test-api-key"
process.env.SENDGRID_VERIFIED_EMAIL = "verified@example.com"
process.env.SENDGRID_TEST_EMAIL = "test@example.com"

jest.mock("../src/config", () => {
  const { timeToMs } = require("../src/utils/time")

  return {
    JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
    //
    EXPIRATION_JWT_TOKEN: timeToMs(process.env.EXPIRATION_JWT_TOKEN),
    EXPIRATION_REFRESH_TOKEN: timeToMs(process.env.EXPIRATION_REFRESH_TOKEN),
    EXPIRATION_XSRF_TOKEN: timeToMs(process.env.EXPIRATION_XSRF_TOKEN),
    EXPIRATION_PASSWORD_RESET_TOKEN: timeToMs(process.env.EXPIRATION_PASSWORD_RESET_TOKEN),
    EXPIRATION_MAGIC_LOGIN_TOKEN: timeToMs(process.env.EXPIRATION_MAGIC_LOGIN_TOKEN),
    //
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_VERIFIED_EMAIL: process.env.SENDGRID_VERIFIED_EMAIL,
    SENDGRID_TEST_EMAIL: process.env.SENDGRID_TEST_EMAIL,
  }
})
