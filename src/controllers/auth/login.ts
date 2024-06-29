import { eq } from "drizzle-orm"
import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import db from "../../db"
import { User, tableUsers } from "../../db/schema"
import { validateHash } from "../../utils/crypt"
import { generateJwt } from "../../utils/generateJwt"

/**
 * login
 */
export const login = async ({ body }: Request, res: Response) => {
  try {
    const { username, password } = body as Record<string, string>
    const users: User[] = await db.select().from(tableUsers).where(eq(tableUsers.username, username))

    const user = users[0]

    if (password.length > 0 && user && user.password && user.password?.length > 0) {
      await validateHash(password, user.password)
      const accessToken = generateJwt(user)
      res.status(HTTP_SUCCESS.OK).json({ accessToken })
    } else {
      res.status(HTTP_CLIENT_ERROR.FORBIDDEN).send("Not today, buddy")
    }
  } catch (error) {
    res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error logging in")
  }
}
