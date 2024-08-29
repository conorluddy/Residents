import { NextFunction, Request, RequestHandler, Response } from "express"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from "../../constants/http"
import { logger } from "../../utils/logger"
import { Meta } from "../../db/types"
import { BadRequestError } from "../../errors"

// Define the valid keys for updating user meta
type ValidMutableMetaProps = Exclude<keyof Meta, "id" | "userId">
const validUserMetaKeys: ValidMutableMetaProps[] = [
  "metaItem",
  // List other mutable metadata keys here
]

const userMeta: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateUserMetaPayload = req.body

    // Ensure the payload is an object
    if (typeof updateUserMetaPayload !== "object" || updateUserMetaPayload === null) {
      throw new BadRequestError("Invalid data provided.")
    }

    // Validate that all keys in the payload are allowed
    const payloadKeys = Object.keys(updateUserMetaPayload)
    const isValidPayload = payloadKeys.every((key) => validUserMetaKeys.includes(key as ValidMutableMetaProps))

    if (!isValidPayload) {
      return res
        .status(HTTP_CLIENT_ERROR.BAD_REQUEST)
        .json({ message: "Invalid data provided. Some items are not allowed." })
    }

    // If payload is valid, proceed to the next middleware/controller
    next()
  } catch (error) {
    logger.error("Request validation error: ", error)
    return res.status(HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Invalid request" })
  }
}

export default userMeta
