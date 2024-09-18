import { rateLimit } from 'express-rate-limit'
import { TIMESPAN } from '../../constants/time'
import { RateLimitError } from '../../errors'

// https://www.npmjs.com/package/express-rate-limit
// TODO - Configure rate limiter in .env

// Default/general rate limit
const rateLimiter = rateLimit({
  windowMs: TIMESPAN.MINUTE * 10,
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  handler: () => {
    throw new RateLimitError('Too many requests, please chill for a bit.')
  },
  // store: ... , // Redis, Memcached, etc. - for rate limiting across distributed systems when you scale.
})

const rateLimitOncePerTenMins = rateLimit({
  windowMs: TIMESPAN.MINUTE * 10,
  limit: 1,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: () => {
    throw new RateLimitError('You can only request this once every 10 minutes.')
  },
})

const rateLimitTenPerTenMins = rateLimit({
  windowMs: TIMESPAN.MINUTE * 10,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: () => {
    throw new RateLimitError('Too many requests, please try again after 10 minutes.')
  },
})

export default rateLimiter

export { rateLimiter, rateLimitOncePerTenMins, rateLimitTenPerTenMins }
