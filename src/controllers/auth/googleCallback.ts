import { Response } from 'express'
import MESSAGES from '../../constants/messages'
import { SafeUser } from '../../db/types'
import { ForbiddenError, LoginError } from '../../errors'
import { ResidentRequest, ResidentResponse } from '../../types'
import { generateJwtFromUser } from '../../utils/generateJwt'
import SERVICES from '../../services'
import { TOKEN_TYPE } from '../../constants/database'
import { REFRESH_TOKEN, RESIDENT_TOKEN, XSRF_TOKEN } from '../../constants/keys'
import { EXPIRATION_REFRESH_TOKEN_MS } from '../../config'
import generateXsrfToken from '../../middleware/util/xsrfToken'

/**
 * googleCallback
 */
export const googleCallback = async (req: ResidentRequest, res: Response<ResidentResponse>): Promise<void> => {
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

  const refreshTokenId = await SERVICES.createToken({
    userId: id,
    type: TOKEN_TYPE.REFRESH,
  })

  if (!refreshTokenId) {
    throw new ForbiddenError(MESSAGES.REFRESH_TOKEN_CREATION_FAILED)
  }

  res.cookie(REFRESH_TOKEN, refreshTokenId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: EXPIRATION_REFRESH_TOKEN_MS,
  })

  res.cookie(XSRF_TOKEN, generateXsrfToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: EXPIRATION_REFRESH_TOKEN_MS,
  })

  // This is probably redundant as the id is in the jwt anyway... Revisit
  res.cookie(RESIDENT_TOKEN, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: EXPIRATION_REFRESH_TOKEN_MS,
  })

  // This will likely only be used by browsers/apps,
  // so we send a redirect with the token rather than a JSON response.
  // the browser can then pull the JWT from the redirect URL params.
  // handleSuccessResponse({ res, token })
  res.redirect(`${googleLoginRedirectURL}?token=${token}`)
}

export const googleLoginRedirectURL = process.env.FRONTEND_URL || 'http://localhost:5173'
