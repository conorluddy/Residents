import { eq, or } from "drizzle-orm"
import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import db from "../../db"
import { User, tableUsers } from "../../db/schema"
import { validateHash } from "../../utils/crypt"
import { generateJwt } from "../../utils/generateJwt"
import { isEmail } from "validator"
import { logger } from "../../utils/logger"

/**
 * login
 */
export const login = async ({ body }: Request, res: Response) => {
  try {
    const { username, email, password } = body as Record<string, string>

    if (!username && !email) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).send("Username or email is required")
    }
    if (!password) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).send("Password is required")
    }
    if (!username && email && !isEmail(email)) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).send("Invalid email address")
    }

    const users: User[] = await db
      .select()
      .from(tableUsers)
      .where(or(eq(tableUsers.username, username), eq(tableUsers.email, email)))

    const user = users[0]

    if (
      password.length > 0 &&
      user?.password &&
      user.password.length > 0 &&
      (await validateHash(password, user.password))
    ) {
      const accessToken = generateJwt(user)
      return res.status(HTTP_SUCCESS.OK).json({ accessToken })
    }
    return res.sendStatus(HTTP_CLIENT_ERROR.FORBIDDEN)
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error logging in")
  }
}
