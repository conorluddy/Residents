import { NextFunction, Request, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { logger } from "../../utils/logger"
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, NotImplementedError } from "../../errors"

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err) {
    logger.error(err.message)

    if (err instanceof BadRequestError) {
      return res.status(HTTP_CLIENT_ERROR.BAD_REQUEST).json({ message: err.message })
    }
    if (err instanceof UnauthorizedError) {
      return res.status(HTTP_CLIENT_ERROR.UNAUTHORIZED).json({ message: err.message })
    }
    if (err instanceof ForbiddenError) {
      return res.status(HTTP_CLIENT_ERROR.FORBIDDEN).json({ message: err.message })
    }
    if (err instanceof NotFoundError) {
      return res.status(HTTP_CLIENT_ERROR.NOT_FOUND).json({ message: err.message })
    }
    if (err instanceof NotImplementedError) {
      return res.status(HTTP_SERVER_ERROR.NOT_IMPLEMENTED).json({ message: err.message })
    }

    // Default to InternalServerError for other unhandled cases
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Something went kaput..." })
  }
  next()
}

export default errorHandler
