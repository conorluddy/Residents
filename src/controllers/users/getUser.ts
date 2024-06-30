import { eq } from "drizzle-orm"
import { Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import db from "../../db"
import { tableUsers } from "../../db/schema"
import { logger } from "../../utils/logger"

/**
 * getUser
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id

    if (!userId) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).send("ID is missing in the request.")
    }

    const user = await db.select().from(tableUsers).where(eq(tableUsers.id, userId))

    return res.status(HTTP_SUCCESS.OK).json(user)
  } catch (error) {
    logger.error(error)
    {
      return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error getting users")
    }
  }
}
