import { NextFunction, Request, Response } from "express"
import { STATUS, TOKEN_TYPE } from "../../constants/database"
import { HTTP_SUCCESS } from "../../constants/http"
import { BadRequestError, ForbiddenError } from "../../errors"
import SERVICES from "../../services"
import { REQUEST_TOKEN } from "../../types/requestSymbols"
import { logger } from "../../utils/logger"

/**
 * validateAccount
 */
export const validateAccount = async (req: Request, res: Response, next: NextFunction) => {
  const { tokenId, userId: userIdFromUrlParam } = req.params
  const token = req[REQUEST_TOKEN]

  if (!userIdFromUrlParam) throw new BadRequestError("Invalid user data.")
  if (!token) throw new ForbiddenError("Validation token missing.")
  if (token.type !== TOKEN_TYPE.VALIDATE) throw new ForbiddenError("Validation token invalid.")
  if (token.userId !== userIdFromUrlParam) throw new ForbiddenError("Validation token invalid.")

  logger.info(`Attempting to validate User ${userIdFromUrlParam} with Token ${tokenId}`)
  await SERVICES.updateUserStatus({ userId: userIdFromUrlParam, status: STATUS.VERIFIED })

  logger.info(`User ${userIdFromUrlParam} validated.`)

  return res.status(HTTP_SUCCESS.OK).json({ message: "Account validated." })
}
