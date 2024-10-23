import { Response } from 'express'
import { EXPIRATION_REFRESH_TOKEN_MS } from '../../config'
import { TOKEN_TYPE } from '../../constants/database'
import { REFRESH_TOKEN, RESIDENT_TOKEN, XSRF_TOKEN } from '../../constants/keys'
import MESSAGES from '../../constants/messages'
import { TIMESPAN } from '../../constants/time'
import { ForbiddenError } from '../../errors'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import generateXsrfToken from '../../middleware/util/xsrfToken'
import SERVICES from '../../services'
import { REQUEST_TOKEN } from '../../types/requestSymbols'
import { generateJwtFromUser } from '../../utils/generateJwt'
import { ResidentRequest, ResidentResponse } from '../../types'

/**
 * GET: magicLoginWithToken
 */
export const magicLoginWithToken = async (req: ResidentRequest, res: Response<ResidentResponse>): Promise<void> => {
  const token = req[REQUEST_TOKEN]!

  if (!req[REQUEST_TOKEN]) {
    throw new ForbiddenError(MESSAGES.TOKEN_REQUIRED)
  }

  const [user] = await Promise.all([SERVICES.getUserById(token.userId), SERVICES.deleteToken({ tokenId: token.id })])

  if (!user) {
    throw new ForbiddenError(MESSAGES.USER_NOT_FOUND_FOR_TOKEN)
  }

  const refreshTokenId = await SERVICES.createToken({
    userId: user.id,
    type: TOKEN_TYPE.REFRESH,
    expiry: TIMESPAN.WEEK,
  })

  if (!refreshTokenId) {
    throw new ForbiddenError(MESSAGES.REFRESH_TOKEN_CREATION_FAILED)
  }

  // Set the tokens in HTTP-only secure cookies

  const jwt = generateJwtFromUser(user)
  res.cookie(REFRESH_TOKEN, refreshTokenId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: EXPIRATION_REFRESH_TOKEN_MS,
  })

  const xsrfToken = generateXsrfToken()
  res.cookie(XSRF_TOKEN, xsrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: EXPIRATION_REFRESH_TOKEN_MS,
  })

  res.cookie(RESIDENT_TOKEN, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: EXPIRATION_REFRESH_TOKEN_MS,
  })

  handleSuccessResponse({ res, token: jwt })
}
