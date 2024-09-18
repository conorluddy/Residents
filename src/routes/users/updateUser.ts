import { Router } from 'express'
import { authenticateToken } from '../../middleware/auth/jsonWebTokens'
import RBAC from '../../middleware/auth/rbac'
import CONTROLLERS from '../../controllers'

const router = Router()

router.patch('/:id', authenticateToken, RBAC.getTargetUser, RBAC.checkCanUpdateUser, CONTROLLERS.USER.updateUser)

export default router
