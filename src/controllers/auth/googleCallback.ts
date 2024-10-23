import { Response } from 'express'
import MESSAGES from '../../constants/messages'
import { LoginError } from '../../errors'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import { generateJwtFromUser } from '../../utils/generateJwt'
import { SafeUser } from '../../db/types'
import { ResidentRequest, ResidentResponse } from '../../types'

/**
 * googleCallback
 */
export const googleCallback = (req: ResidentRequest, res: Response<ResidentResponse>): void => {
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

  handleSuccessResponse({ res, token })
}
