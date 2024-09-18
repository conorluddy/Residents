import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import { rateLimitOncePerTenMins, rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

router.post('/refresh', rateLimitOncePerTenMins, CONTROLLERS.AUTH.refreshToken)

export default router
