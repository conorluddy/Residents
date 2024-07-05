import { attachDb } from "./database"
import { authenticateToken } from "./jsonWebTokens"
import { RBAC } from "./roleBasedAccessControl"
import errorHandler from "./errorHandler"
import findUserByValidEmail from "./findUserByValidEmail"
import validateRequestEmail from "./validateRequestEmail"

const MW = {
  attachDb,
  authenticateToken,
  RBAC,
  errorHandler,
  findUserByValidEmail,
  validateRequestEmail,
}

export default MW
