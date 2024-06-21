import { Request, Response } from "express"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"

/**
 * updateUser
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    // const user = await db
    //   .select()
    //   .from(tableUsers)
    //   .where(eq(tableUsers.id, Number(userId)))

    return res.status(HTTP_SUCCESS.OK) //.json(user)
  } catch (error) {
    logger.error(error)
    {
      res
        .status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
        .send("Error getting users")
    }
  }
}
