import { Request, Response } from "express"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"

/**
 * deleteUser
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    // const user = await db
    //   .select()
    //   .from(tableUsers)
    //   .where(eq(tableUsers.id, Number(userId)))

    console.log("\n\n\nDELETE\n\n\n")

    return res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).send("Not implemented yet")
    // return res.status(HTTP_SUCCESS.OK).json({ message: "User deleted" })
  } catch (error) {
    logger.error(error)
    {
      res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error getting users")
    }
  }
}
