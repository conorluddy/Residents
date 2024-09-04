import { NextFunction, Request, Response } from "express"
import { HTTP_SUCCESS } from "../../constants/http"
import SERVICES from "../../services"

/**
 * deleteExpiredTokens
 * Utility to probably to be run on a cron job or similar
 */
export const deleteExpiredTokens = async (req: Request, res: Response, next: NextFunction) => {
  const count = await SERVICES.deleteExpiredTokens()
  return res.status(HTTP_SUCCESS.OK).json({ message: `${count} expired tokens deleted.` })
}
