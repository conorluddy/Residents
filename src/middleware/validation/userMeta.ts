import { NextFunction, Request, RequestHandler, Response } from "express"
import { Meta } from "../../db/types"
import { BadRequestError } from "../../errors"

// Define the valid keys for updating user meta
type ValidMutableMetaProps = Exclude<keyof Meta, "id" | "userId">

const validUserMetaKeys: ValidMutableMetaProps[] = [
  "metaItem",
  // List other mutable metadata keys here
]

const userMeta: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const updateUserMetaPayload = req.body

  // Ensure the payload is an object
  if (typeof updateUserMetaPayload !== "object" || updateUserMetaPayload === null)
    throw new BadRequestError("Invalid data provided.")

  // Validate that all keys in the payload are allowed
  const payloadKeys = Object.keys(updateUserMetaPayload)
  const isValidPayload = payloadKeys.every((key) => validUserMetaKeys.includes(key as ValidMutableMetaProps))

  if (!isValidPayload) throw new BadRequestError("Invalid data provided.")

  // If payload is valid, proceed to the next middleware/controller
  next()
}

export default userMeta
