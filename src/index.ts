import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import config from './config'
import { attachDb } from './middleware/util/database'
import errorHandler from './middleware/util/errorHandler'
import rateLimiter from './middleware/util/rateLimiter'
import { handleSuccessResponse } from './middleware/util/successHandler'
import authRouter from './routes/auth'
import usersRouter from './routes/users/index'
import swaggerSetup from './swagger'

dotenv.config()

const app = express()

////////////////////////////////////////////////
// Config
////////////////////////////////////////////////

const trustProxyNumber = config.TRUST_PROXY_NUMBER ? parseInt(config.TRUST_PROXY_NUMBER, 10) : 0
if (trustProxyNumber > 0) {
  app.set('trust proxy', config.TRUST_PROXY_NUMBER)
}

////////////////////////////////////////////////
// Middlewares
////////////////////////////////////////////////

app.disable('x-powered-by')
app.use(helmet())
app.use(rateLimiter)
app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  handleSuccessResponse({ res, message: '👌' })
})

app.use(cookieParser())

// Attach the database instance to the request object
app.use(attachDb)

// Routers
app.use('/users', usersRouter)
app.use('/auth', authRouter)

// Swagger
swaggerSetup(app)

// Error handling <always last>
app.use(errorHandler)

////////////////////////////////////////////////
// Exports for NPM etc
////////////////////////////////////////////////

export default app

export { app }
export { logger } from './utils/logger'
export { config } from './config'
export { postgresDatabaseClient, db as drizzleDatabaseClient } from './db'

// Enums and Constants
export { MESSAGES } from './constants/messages'
export { ROLES, STATUS, TOKEN_TYPE } from './constants/database'

// Types
export {
  AdminUser,
  DefaultUser,
  DeletedUser,
  FederatedCredentials,
  LockedUser,
  Meta,
  MetaUpdate,
  ModeratorUser,
  NewFederatedCredentials,
  NewMeta,
  NewToken,
  NewUser,
  OwnerUser,
  PublicUser,
  SafeUser,
  Token,
  TokenWithUser,
  User,
  UserUpdate,
  UserWithMeta,
} from './db/types'
