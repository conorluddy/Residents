import { NextFunction, RequestHandler, Response } from 'express'
import { Meta, UserUpdate } from '../../db/types'
import { BadRequestError } from '../../errors'
import MESSAGES from '../../constants/messages'
import { ResidentRequest, ResidentResponse } from '../../types'

// Define the valid keys for updating user meta
type ValidMutableMetaProps = Exclude<keyof Meta, 'id' | 'userId'>

const validUserMetaKeys: ValidMutableMetaProps[] = [
  'metaItem',
  // List other mutable metadata keys here
]

const validateUserMeta: RequestHandler = (
  req: ResidentRequest,
  _res: Response<ResidentResponse>,
  next: NextFunction
) => {
  const { body }: Record<'body', UserUpdate> = req
  const updateUserMetaPayload: UserUpdate = body

  // Ensure the payload is an object
  if (typeof updateUserMetaPayload !== 'object' || updateUserMetaPayload === null) {
    throw new BadRequestError(MESSAGES.INVALID_DATA_PROVIDED)
  }

  // Validate that all keys in the payload are allowed
  const payloadKeys = Object.keys(updateUserMetaPayload)
  const isValidPayload = payloadKeys.every((key) => validUserMetaKeys.includes(key as ValidMutableMetaProps))

  if (!isValidPayload) {
    throw new BadRequestError(MESSAGES.INVALID_DATA_PROVIDED)
  }

  // If payload is valid, proceed to the next middleware/controller
  // TODO: Attach the payload into a request symbol for use in the controller
  next()
}

export default validateUserMeta
