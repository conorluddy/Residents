// Util
import { attachDb } from "./database"
import errorHandler from "./errorHandler"
import discardToken from "./discardToken"

// Validate
import RBAC from "./roleBasedAccessControl"
import VALIDATE from "./validation"
import { authenticateToken } from "./jsonWebTokens"

// Find
import findUserByValidEmail from "./findUserByValidEmail"
import findUserByValidToken from "./findUserByValidToken"

const MW = {
  RBAC,
  VALIDATE,
  attachDb,
  authenticateToken,
  errorHandler,
  findUserByValidEmail,
  findUserByValidToken,
  discardToken,
}

export default MW
