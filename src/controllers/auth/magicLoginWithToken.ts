import { NextFunction, Request, Response } from "express"
import { HTTP_SERVER_ERROR } from "../../constants/http"
import { NotImplementedError } from "../../errors"

/**
 * GET: magicLoginWithToken
 */
export const magicLoginWithToken = async (_req: Request, res: Response, next: NextFunction) => {
  throw new NotImplementedError("Not implemented yet.")
}
