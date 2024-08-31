import { NextFunction, Request, Response } from "express"
import { HTTP_SERVER_ERROR } from "../../constants/http"
import { BadRequestError } from "../../errors"

/**
 * magicLogin
 */
export const magicLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email }: Record<string, string> = req.body
  if (!email) throw new BadRequestError("Email is required.")
  return res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).json({ message: "Not implemented yet." })
}
