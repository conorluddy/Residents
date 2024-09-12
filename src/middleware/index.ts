import { attachDb } from "./util/database"
import { authenticateToken } from "./auth/jsonWebTokens"
import discardToken from "./auth/discardToken"
import errorHandler from "./util/errorHandler"
import findUserByValidEmail from "./lookup/findUserByValidEmail"
import RBAC from "./auth/rbac"
import VALIDATE from "./validation"
import findValidTokenById from "./lookup/findValidTokenById"

const MW = {
  RBAC,
  VALIDATE,

  // Move these into groups
  attachDb,
  authenticateToken,
  errorHandler,
  findUserByValidEmail,
  findValidTokenById,
  discardToken,
}

export default MW
