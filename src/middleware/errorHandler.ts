import { Request, Response } from "express"
import { HTTP_SERVER_ERROR } from "../constants/http"
import { logger } from "../utils/logger"

const errorHandler = (err: Error, _req: Request, res: Response) => {
  logger.error(err)
  res
    .status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR)
    .send({ errors: [{ message: "Something went wrong" }] })
}

export default errorHandler
