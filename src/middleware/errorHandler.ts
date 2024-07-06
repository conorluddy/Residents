import { NextFunction, Request, Response } from "express"
import { HTTP_SERVER_ERROR } from "../constants/http"
import { logger } from "../utils/logger"

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err) {
    logger.error(err)
    return res.sendStatus(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
  }
  next()
}

export default errorHandler
