// config.test.ts
import { timeToMs } from "./utils/time"
import {
  JWT_TOKEN_SECRET,
  EXPIRATION_JWT_TOKEN,
  EXPIRATION_REFRESH_TOKEN,
  EXPIRATION_XSRF_TOKEN,
  EXPIRATION_PASSWORD_RESET_TOKEN,
  EXPIRATION_MAGIC_LOGIN_TOKEN,
  SENDGRID_API_KEY,
  SENDGRID_VERIFIED_EMAIL,
  SENDGRID_TEST_EMAIL,
} from "./config"

describe("Configuration Module", () => {
  it("should correctly load environment variables", () => {
    expect(JWT_TOKEN_SECRET).toBe("test-secret")
    expect(SENDGRID_API_KEY).toBe("test-api-key")
    expect(SENDGRID_VERIFIED_EMAIL).toBe("verified@example.com")
    expect(SENDGRID_TEST_EMAIL).toBe("test@example.com")
  })

  it("should correctly parse expiration times", () => {
    expect(EXPIRATION_JWT_TOKEN).toBe(timeToMs("1m"))
    expect(EXPIRATION_REFRESH_TOKEN).toBe(timeToMs("1m"))
    expect(EXPIRATION_XSRF_TOKEN).toBe(timeToMs("1m"))
    expect(EXPIRATION_PASSWORD_RESET_TOKEN).toBe(timeToMs("1m"))
    expect(EXPIRATION_MAGIC_LOGIN_TOKEN).toBe(timeToMs("1m"))
  })
})
