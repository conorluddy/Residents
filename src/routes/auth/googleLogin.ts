import { Router } from 'express'
import { googlePassport } from '../../passport/google'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router().get(
  '/google',
  rateLimitTenPerTenMins,
  googlePassport.authenticate('google', { scope: ['email', 'profile'] })
)

export default router
