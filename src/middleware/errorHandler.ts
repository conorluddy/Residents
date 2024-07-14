import { NextFunction, Request, Response } from "express"
import { HTTP_SERVER_ERROR } from "../constants/http"
import { logger } from "../utils/logger"

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err) {
    logger.error(err.message)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Something went kaput." })
  }
  next()
}

export default errorHandler
