import request from 'supertest'
import express from 'express'
import magicLoginRoute from './magicLogin'
import CONTROLLERS from '../../controllers'
import { HTTP_SERVER_ERROR } from '../../constants/http'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'

CONTROLLERS.AUTH.magicLogin = jest.fn(async (_req, res) => {
  return handleSuccessResponse({ res, message: MESSAGES.LOGIN_SUCCESS })
})

jest.mock('../../db', () => ({
  select: jest.fn().mockResolvedValue([]),
}))

const app = express()
app.use(express.json())
app.use(magicLoginRoute)

describe.skip('GET /magicLogin', () => {
  it('should call the magicLogin controller and do nothin because it is not implemented yet', async () => {
    const response = await request(app).post('/magic-login').send({ email: 'not@implemented.com' })
    expect(response.status).toBe(HTTP_SERVER_ERROR.NOT_IMPLEMENTED)
  })
})
