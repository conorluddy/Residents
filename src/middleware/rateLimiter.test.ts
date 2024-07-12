import request from "supertest"
import express from "express"
import rateLimiter from "./rateLimiter"

const app = express()
app.use(rateLimiter)
app.get("/", (_req, res) => {
  res.send("Test response")
})

describe("Rate Limiter Middleware", () => {
  it("should allow requests under the rate limit", async () => {
    for (let i = 0; i < 100; i++) {
      const response = await request(app).get("/")
      expect(response.status).toBe(200)
      expect(response.text).toBe("Test response")
    }
  })

  it("should block requests over the rate limit", async () => {
    for (let i = 0; i < 100; i++) {
      await request(app).get("/")
    }

    const response = await request(app).get("/")
    expect(response.status).toBe(429)
  })

  it("should include rate limit headers", async () => {
    const response = await request(app).get("/")
    expect(response.headers["ratelimit"]).toBe("limit=100, remaining=0, reset=900")
    expect(response.headers["ratelimit-policy"]).toBe("100;w=900")
    expect(response.headers["retry-after"]).toBe("900")
  })
})
