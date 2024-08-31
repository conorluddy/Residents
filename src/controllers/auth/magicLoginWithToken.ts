import { NextFunction, Request, Response } from "express"
import { HTTP_SERVER_ERROR } from "../../constants/http"

/**
 * GET: magicLoginWithToken
 */
export const magicLoginWithToken = async (_req: Request, res: Response, next: NextFunction) => {
  return res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).json({ message: "Not implemented yet." })
}
