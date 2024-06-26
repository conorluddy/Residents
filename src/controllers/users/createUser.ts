import { Request, Response } from "express"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { NewUser, tableUsers } from "../../db/schema"
import { createHash } from "../../utils/crypt"
import { logger } from "../../utils/logger"
import db from "../../db"

/**
 * createUser
 */
export const createUser = async ({ body }: Request, res: Response) => {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      password: plainPassword,
    } = body
    const password = await createHash(plainPassword)
    const user: NewUser = {
      firstName,
      lastName,
      email,
      username,
      password,
    }
    await db.insert(tableUsers).values(user).returning()

    res.status(HTTP_SUCCESS.CREATED).send("User registered")
  } catch (error) {
    logger.error(error)
    res
      .status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .send("Error registering user")
  }
}
