import { Router } from 'express'
import CONTROLLERS from '../../controllers'
import { rateLimitTenPerTenMins } from '../../middleware/util/rateLimiter'

const router = Router()

router.post('/refresh', rateLimitTenPerTenMins, CONTROLLERS.AUTH.refreshToken)

export default router
