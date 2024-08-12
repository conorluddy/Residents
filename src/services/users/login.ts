// // src/services/userService.ts

import { TOKEN_TYPE } from "../../constants/database"
import { TIMESPAN } from "../../constants/time"
import { User } from "../../db/types"
import generateXsrfToken from "../../middleware/util/xsrfToken"
import { insertRefreshToken } from "../../repositories/tokens"
import { findUserByUsernameOrEmail } from "../../repositories/users"
import { validateHash } from "../../utils/crypt"
import { generateJwt } from "../../utils/generateJwt"

/**
 * Handles user login and returns tokens if successful.
 */
export const loginUser = async (username?: string, email?: string, password?: string) => {
  if (!username && !email) {
    throw new Error("Username or email is required")
  }

  if (!password) {
    throw new Error("Password is required")
  }

  const users: User[] = await findUserByUsernameOrEmail(username, email)

  if (!users || users.length === 0) {
    throw new Error("User not found")
  }

  const user = users[0]

  if (
    password.length > 0 &&
    user?.password &&
    user.password.length > 0 &&
    (await validateHash(password, user.password))
  ) {
    const newRefreshToken = {
      userId: user.id,
      type: TOKEN_TYPE.REFRESH,
      expiresAt: new Date(Date.now() + TIMESPAN.WEEK), // Configurable
    }

    const refreshToken = await insertRefreshToken(newRefreshToken)
    const accessToken = generateJwt(user)
    const xsrfToken = generateXsrfToken()

    return { accessToken, refreshToken, xsrfToken }
  }

  throw new Error("Invalid credentials")
}
