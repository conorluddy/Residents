import { Request, Response } from 'express'
import { generateJwtFromUser } from '../../utils/generateJwt'
import { OAuth2Client } from 'google-auth-library'
import { EmailError, NotFoundError, UnauthorizedError } from '../../errors'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import SERVICES from '../../services'
import MESSAGES from '../../constants/messages'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

/**
 * googleCallback
 */
export const googleCallback = async (req: Request, res: Response): Promise<Response> => {
  const ticket = await client.verifyIdToken({
    idToken: req.body.idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  const payload = ticket.getPayload()

  if (!payload) {
    throw new UnauthorizedError(MESSAGES.INVALID_GOOGLE_CALLBACK_TOKEN)
  }

  const userEmail = payload.email
  if (!userEmail) {
    throw new EmailError(MESSAGES.NO_EMAIL_IN_GOOGLE_PAYLOAD)
  }

  const user = await SERVICES.getUserByEmail(userEmail)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  const token = generateJwtFromUser(user)

  return handleSuccessResponse({ res, token })
}
