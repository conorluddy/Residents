import { Response } from 'express'
import MESSAGES from '../../constants/messages'
import { SafeUser } from '../../db/types'
import { LoginError } from '../../errors'
import { ResidentRequest, ResidentResponse } from '../../types'
import { generateJwtFromUser } from '../../utils/generateJwt'

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

  // TODO: We need to add the logged in cookies here, refreshtoken etc

  // This just responds with JSON but we want to redirect to a FE with a param
  // handleSuccessResponse({ res, token })
  res.redirect(`${googleLoginRedirectURL}?token=${token}`)
}

export const googleLoginRedirectURL = process.env.FRONTEND_URL || 'http://localhost:5173'
