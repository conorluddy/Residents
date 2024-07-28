import { eq, or } from "drizzle-orm"
import { Request, RequestHandler, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import db from "../../db"
import { User, tableTokens, tableUsers } from "../../db/schema"
import { validateHash } from "../../utils/crypt"
import { generateJwt } from "../../utils/generateJwt"
import { isEmail } from "validator"
import { logger } from "../../utils/logger"
import { NewToken } from "../../db/types"
import { TOKEN_TYPE } from "../../constants/database"

/**
 * login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = (req.body ?? {}) as Pick<User, "username" | "email" | "password">

    if (!username && !email) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Username or email is required" })
    }

    if (!password) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Password is required" })
    }

    if (!username && email && !isEmail(email)) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: "Invalid email address" })
    }

    const users: User[] = await db
      .select()
      .from(tableUsers)
      .where(or(eq(tableUsers.username, username), eq(tableUsers.email, email)))

    if (!users || users.length === 0) {
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Nope." })
    }

    const user = users[0]

    if (
      password.length > 0 &&
      user?.password &&
      user.password.length > 0 &&
      (await validateHash(password, user.password))
    ) {
      const accessToken = generateJwt(user)

      const newRefreshToken: NewToken = {
        userId: user.id,
        type: TOKEN_TYPE.REFRESH,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // TODO: Make configurable
      }
      const [refreshToken] = await db.insert(tableTokens).values(newRefreshToken).returning() // see if we can get this to not return an array

      return res.status(HTTP_SUCCESS.OK).json({ accessToken, refreshToken })
    }

    return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: "Nope." })
  } catch (error) {
    console.log("\n\nerror", error)

    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error logging in" })
  }
}
