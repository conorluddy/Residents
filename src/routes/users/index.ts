import { Router } from 'express'
import getAllUsers from './getAllUsers'
import getUser from './getUser'
import createUser from './createUser'
import updateUser from './updateUser'
import updateUserMeta from './updateUserMeta'
import deleteUser from './deleteUser'
import getSelf from './getSelf'
import xsrfTokens from '../../middleware/auth/xsrfTokens'
import rateLimiter from '../../middleware/util/rateLimiter'
import errorHandler from '../../middleware/util/errorHandler'

const router = Router()

// Middleware
router.use(errorHandler)
router.use(xsrfTokens)

// General rate limiter for all of these User CRUD routes
router.use(rateLimiter)

// Routes
router.use(createUser)
router.use(updateUser)
router.use(updateUserMeta)
router.use(getAllUsers)
router.use(deleteUser)

// Order matters for getSelf and getUser
// because the routes are the same, and we
// don't want "self" to be treated as an ID
router.use(getSelf)
router.use(getUser)

export default router
