import express from 'express'
import request from 'supertest'
import { TOKEN_TYPE } from '../../constants/database'
import { HTTP_SUCCESS } from '../../constants/http'
import { TIMESPAN } from '../../constants/time'
import { makeAFakeSafeUser } from '../../test-utils/mockUsers'
import { REQUEST_TOKEN, REQUEST_TOKEN_ID, REQUEST_USER } from '../../types/requestSymbols'
import validateAccountRoute from './validateAccount'
import { createId } from '@paralleldrive/cuid2'
import { logger } from '../../utils/logger'
import MESSAGES from '../../constants/messages'

const user = makeAFakeSafeUser({ email: 'bananaman@ireland.ie', id: 'UID123' })
const validTokenId = createId()
const token = {
  user,
  id: validTokenId,
  userId: user.id,
  type: TOKEN_TYPE.VALIDATE,
  used: false,
  expiresAt: new Date(Date.now() + TIMESPAN.MINUTE),
  createdAt: new Date(),
}

jest.mock('../../services/index', () => ({
  getToken: jest.fn().mockImplementationOnce(() => token),
  deleteToken: jest.fn().mockImplementationOnce(async () => validTokenId),
  updateUserStatus: jest.fn().mockImplementationOnce(async () => user.id),
}))

const app = express()
app.use(express.json())
app.use(validateAccountRoute)
app.use((req, _res, next) => {
  req[REQUEST_USER] = user
  req[REQUEST_TOKEN] = token
  req[REQUEST_TOKEN_ID] = validTokenId
  next()
})

describe('GET /validateAccount', () => {
  it('should call the validateAccount controller', async () => {
    const response = await request(app).patch(`/validate/${validTokenId}.${user.id}`)
    expect(logger.error).not.toHaveBeenCalled()
    expect(response.body).toStrictEqual({ message: MESSAGES.ACCOUNT_VALIDATED })
    expect(response.status).toBe(HTTP_SUCCESS.OK)
  })
})
