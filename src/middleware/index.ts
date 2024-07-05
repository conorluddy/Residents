import { attachDb } from "./database"
import { authenticateToken } from "./jsonWebTokens"
import { RBAC } from "./roleBasedAccessControl"
import errorHandler from "./errorHandler"
import findUserByValidEmail from "./findUserByValidEmail"
import validateRequestEmail from "./validateRequestEmail"
import validateRequestToken from "./validateRequestToken"
import findUserByValidToken from "./findUserByValidToken"
import discardToken from "./discardToken"

const MW = {
  attachDb,
  authenticateToken,
  RBAC,
  errorHandler,
  findUserByValidEmail,
  findUserByValidToken,
  validateRequestEmail,
  validateRequestToken,
  discardToken,
}

export default MW
