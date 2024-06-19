import { Request, Response } from "express"
import { NewUser, User, tableUsers } from "../db/schema"
import { createHash, validateHash } from "../utils/crypt"
import db from "../db"
import { eq } from "drizzle-orm"
import {
  HTTP_CLIENT_ERROR,
  HTTP_SERVER_ERROR,
  HTTP_SUCCESS,
} from "../constants/http"
import { generateJwt } from "../utils/jwt"
import { logger } from "../utils/logger"

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

/**
 * getAllUsers
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result: User[] = await db.select().from(tableUsers)
    return res.status(HTTP_SUCCESS.OK).json(result)
  } catch (error) {
    logger.error(error)
    res
      .status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .send("Error getting users")
  }
}

/**
 * getUser
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    const user = await db
      .select()
      .from(tableUsers)
      .where(eq(tableUsers.id, Number(userId)))

    return res.status(HTTP_SUCCESS.OK).json(user)
  } catch (error) {
    logger.error(error)
    {
      res
        .status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
        .send("Error getting users")
    }
  }
}

/**
 * loginUser
 */
export const loginUser = async ({ body }: Request, res: Response) => {
  try {
    const { username, password } = body as Record<string, string>
    const results: User[] = await db
      .select()
      .from(tableUsers)
      .where(eq(tableUsers.username, username))

    const user = results[0]

    if (user && (await validateHash(password, user.password))) {
      const accessToken = generateJwt(user)
      res.status(HTTP_SUCCESS.OK).json({ accessToken })
    } else {
      res.status(HTTP_CLIENT_ERROR.FORBIDDEN).send("Not today, buddy")
    }
  } catch (error) {
    res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error logging in")
  }
}
