import SERVICES from '../../services'
import { Response } from 'express'
import { BadRequestError } from '../../errors'
import { REFRESH_TOKEN } from '../../constants/keys'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'
import { ResidentRequest, ResidentResponse } from '../../types'

/**
 * logout
 */
export const logout = async (req: ResidentRequest, res: Response<ResidentResponse>): Promise<void> => {
  // Clear the cookie regardless of whether we have an existing one
  res.cookie(REFRESH_TOKEN, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  })

  // Look up userId via the refresh token — avoids trusting a separate cookie
  const refreshTokenId = req.cookies?.[REFRESH_TOKEN]
  if (!refreshTokenId) {
    throw new BadRequestError(MESSAGES.REFRESH_TOKEN_REQUIRED)
  }

  // Best-effort DB cleanup: token may already be expired/deleted (e.g. admin purge).
  // Cookie is already cleared above, so the user is effectively logged out regardless.
  const token = await SERVICES.getToken({ tokenId: refreshTokenId })
  if (token?.userId) {
    await SERVICES.deleteRefreshTokensByUserId({ userId: token.userId })
  }

  handleSuccessResponse({ res, message: MESSAGES.LOGOUT_SUCCESS })
}
