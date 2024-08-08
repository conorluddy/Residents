import { Request, Response } from "express"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import db from "../../db"
import { User, tableUsers } from "../../db/schema"
import { logger } from "../../utils/logger"

/**
 * getAllUsers - This will need pagination and filtering/searching
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Add a WITHMETA flag to include the user meta data
    // Specify the fields to return so we don't have to map to remove the password separately
    const users: User[] = await db.select().from(tableUsers)
    const shareableUsers = users.map((user) => {
      const { password, ...shareableUser } = user
      return shareableUser
    })

    return res.status(HTTP_SUCCESS.OK).json(shareableUsers)
  } catch (error) {
    logger.error(error)
    res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error getting users" })
  }
}

export default getAllUsers
