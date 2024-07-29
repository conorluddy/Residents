import { rateLimit } from "express-rate-limit"

// https://www.npmjs.com/package/express-rate-limit
// TODO - Configure rate limiter in .env
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc.
})

// https://www.npmjs.com/package/express-rate-limit
// TODO - Configure rate limiter in .env
const rateLimiterSensitive = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5, // 5 tries per hour
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc.
})

export default rateLimiter

export { rateLimiter, rateLimiterSensitive }
