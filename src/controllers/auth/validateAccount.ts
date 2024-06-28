import { Request, Response } from "express"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { logger } from "../../utils/logger"

/**
 * deleteUser
 */
export const validateAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    console.log("\n\n\nVALIDATE ME\n\n\n")
    return res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).send("Not implemented yet")
  } catch (error) {
    logger.error(error)
    res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Error getting users")
  }
}
