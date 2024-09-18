import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

router.get('/logout', rateLimitTenPerTenMins, CONTROLLERS.AUTH.logout)

export default router
