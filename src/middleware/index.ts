import { attachDb } from "./util/database"
import { authenticateToken } from "./auth/jsonWebTokens"
import discardToken from "./auth/discardToken"
import errorHandler from "./util/errorHandler"
import findUserByValidEmail from "./lookup/findUserByValidEmail"
import findUserByValidToken from "./lookup/findUserByValidToken"
import RBAC from "./auth/roleBasedAccessControl"
import VALIDATE from "./validation"

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
