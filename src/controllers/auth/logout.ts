import SERVICES from '../../services'
import { Request, Response } from 'express'
import { BadRequestError } from '../../errors'
import { REFRESH_TOKEN, RESIDENT_TOKEN, XSRF_TOKEN } from '../../constants/keys'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'

/**
 * logout
 */
export const logout = async (req: Request, res: Response) => {
  // Clear the cookies regardless of whether we have any existing ones

  res.cookie(REFRESH_TOKEN, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  })

  res.cookie(XSRF_TOKEN, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  })

  res.cookie(RESIDENT_TOKEN, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  })

  // Delete the refresh tokens from the database
  const userId = req.cookies?.[RESIDENT_TOKEN]
  if (!userId) {
    throw new BadRequestError(MESSAGES.MISSING_USER_ID)
  }
  await SERVICES.deleteRefreshTokensByUserId({ userId })

  return handleSuccessResponse({ res, message: MESSAGES.LOGOUT_SUCCESS })
}
