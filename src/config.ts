import { timeToMs } from "./utils/time"
import dotenv from "dotenv"
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
    // Codescan doesn't like us logging the names here, even though they're harmless
    console.error(`Missing some required environment variables.`)
    if (process.env.NODE_ENV !== "test") process.exit(1)
  }
})

const config: Config = {
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET!,

  // Tokens
  EXPIRATION_JWT_TOKEN: timeToMs(process.env.EXPIRATION_JWT_TOKEN!),
  EXPIRATION_REFRESH_TOKEN: timeToMs(process.env.EXPIRATION_REFRESH_TOKEN!),
  EXPIRATION_XSRF_TOKEN: timeToMs(process.env.EXPIRATION_XSRF_TOKEN!),
  EXPIRATION_PASSWORD_RESET_TOKEN: timeToMs(process.env.EXPIRATION_PASSWORD_RESET_TOKEN!),
  EXPIRATION_MAGIC_LOGIN_TOKEN: timeToMs(process.env.EXPIRATION_MAGIC_LOGIN_TOKEN!),

  // Sendgrid
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY!,
  SENDGRID_VERIFIED_EMAIL: process.env.SENDGRID_VERIFIED_EMAIL!,
  SENDGRID_TEST_EMAIL: process.env.SENDGRID_TEST_EMAIL!,
}

console.log("config", { config })

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
  EXPIRATION_JWT_TOKEN: number
  EXPIRATION_REFRESH_TOKEN: number
  EXPIRATION_XSRF_TOKEN: number
  EXPIRATION_PASSWORD_RESET_TOKEN: number
  EXPIRATION_MAGIC_LOGIN_TOKEN: number
  SENDGRID_API_KEY: string
  SENDGRID_VERIFIED_EMAIL: string
  SENDGRID_TEST_EMAIL: string
}
