import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import { rateLimitOncePerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

router.post('/refresh', rateLimitOncePerTenMins, CONTROLLERS.AUTH.refreshToken)

export default router
