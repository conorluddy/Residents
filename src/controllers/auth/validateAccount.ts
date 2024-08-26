import { Request, Response } from "express"
import { STATUS, TOKEN_TYPE } from "../../constants/database"
import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import SERVICES from "../../services"
import { REQUEST_TOKEN, REQUEST_USER } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"

/**
 * validateAccount
 */
export const validateAccount = async (req: Request, res: Response) => {
  try {
    const { tokenId, userId: userIdFromUrlParam } = req.params
    const token = req[REQUEST_TOKEN]

    if (!token) throw new Error("Validation token invalid.")
    if (!userIdFromUrlParam) throw new Error("Invalid user data userIdFromUrlParam.")

    logger.info(`Attempting to validate User ${userIdFromUrlParam} with Token ${tokenId}`)

    if (token.type !== TOKEN_TYPE.VALIDATE) {
      logger.error(`Token with ID ${tokenId} isnt a validation type token.`)
      throw new Error("Validation token invalid.")
    }

    if (token.userId !== userIdFromUrlParam) {
      logger.error(`token.userId !== userIdFromUrlParam`, { token, userIdFromUrlParam })
      throw new Error("Validation token invalid.")
    }

    // Validate the user
    await SERVICES.updateUserStatus({ userId: userIdFromUrlParam, status: STATUS.VERIFIED })

    logger.info(`User ${userIdFromUrlParam} validated.`)

    return res.status(HTTP_SUCCESS.OK).json({ message: "Account validated." })
  } catch (error) {
    logger.error(error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Error validating user." })
  }
}
