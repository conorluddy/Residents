import { Router } from 'express'
import { googlePassport } from '../../passport/google'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

router.get(
  '/google/callback',
  rateLimitTenPerTenMins,
  googlePassport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }),
  CONTROLLERS.AUTH.googleCallback
)

export default router
