import { Request, Response } from "express"
import { NewUser, User, tableUsers } from "../db/schema"
import { createHash, validateHash } from "../utils/crypt"
import db from "../db/connection"
import { eq } from "drizzle-orm"
import {
  HTTP_CLIENT_ERROR,
  HTTP_SERVER_ERROR,
  HTTP_SUCCESS,
} from "../constants/http"

export const createUser = async ({ body }: Request, res: Response) => {
  try {
    // Move this to controller
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
    res
      .status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .send("Error registering user")
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result: User[] = await db.select().from(tableUsers)
    return res.status(HTTP_SUCCESS.OK).json(result)
  } catch (err) {
    console.error(err)
    res
      .status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .send("Error getting users")
  }
}

export const loginUser = async ({ body }: Request, res: Response) => {
  try {
    const { username, password } = body as Record<string, string>
    const results: User[] = await db
      .select()
      .from(tableUsers)
      .where(eq(tableUsers.username, username))

    if (results[0] && (await validateHash(password, results[0].password))) {
      res.status(HTTP_SUCCESS.OK).send("Login successful")
    } else {
      res.status(HTTP_CLIENT_ERROR.FORBIDDEN).send("Not today, buddy")
    }
  } catch (error) {
    console.log(error)
    res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error logging in")
  }
}
