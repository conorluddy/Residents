import { Request, Response } from 'express'
import MESSAGES from '../../constants/messages'
import { LoginError } from '../../errors'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import { generateJwtFromUser } from '../../utils/generateJwt'
import { SafeUser } from '../../db/types'

/**
 * googleCallback
 */
export const googleCallback = (req: Request, res: Response): Response => {
  const user = req.user as SafeUser

  if (!user) {
    throw new LoginError(MESSAGES.USER_NOT_FOUND_FEDERATED_CREDENTIALS)
  }

  const { id, username, firstName, lastName, email, role } = user

  const token = generateJwtFromUser({
    id,
    username,
    firstName,
    lastName,
    email,
    role,
  })

  return handleSuccessResponse({ res, token })
}
