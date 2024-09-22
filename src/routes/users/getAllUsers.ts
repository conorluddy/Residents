import { Router } from 'express'
import { authenticateToken } from '../../middleware/auth/jsonWebTokens'
import RBAC from '../../middleware/auth/rbac'
import CONTROLLERS from '../../controllers'

const router = Router()

// Overwriting /self
router.get('/:limit/:offset', authenticateToken, RBAC.checkCanGetAllUsers, CONTROLLERS.USER.getAllUsers)
router.get('/:limit', authenticateToken, RBAC.checkCanGetAllUsers, CONTROLLERS.USER.getAllUsers)
router.get('/', authenticateToken, RBAC.checkCanGetAllUsers, CONTROLLERS.USER.getAllUsers)

export default router
