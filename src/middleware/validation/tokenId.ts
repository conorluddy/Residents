import { isCuid } from "@paralleldrive/cuid2"
import { NextFunction, Request, RequestHandler, Response } from "express"
import { BadRequestError } from "../../errors"
import { REQUEST_TOKEN_ID } from "../../types/requestSymbols"

const validateTokenId: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const tokenId: string | undefined = req.params?.tokenId || req.body?.tokenId || req.query?.tokenId

  if (!tokenId) throw new BadRequestError("A token is required.")

  if (!isCuid(tokenId)) throw new BadRequestError("Invalid token provided.")

  req[REQUEST_TOKEN_ID] = tokenId

  next()
}

export default validateTokenId
