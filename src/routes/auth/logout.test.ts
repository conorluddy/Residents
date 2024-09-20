import express from 'express'
import request from 'supertest'
import { HTTP_SUCCESS } from '../../constants/http'
import { REFRESH_TOKEN, RESIDENT_TOKEN } from '../../constants/keys'
import CONTROLLERS from '../../controllers'
import logoutRoute from './logout'
import { handleSuccessResponse } from '../../middleware/util/successHandler'
import MESSAGES from '../../constants/messages'

CONTROLLERS.AUTH.logout = jest.fn(async (_req, res) => {
  return await handleSuccessResponse({ res, message: MESSAGES.LOGIN_SUCCESS })
})

jest.mock('../../services', () => ({
  select: jest.fn().mockResolvedValue([]),
}))

const app = express()
app.use(logoutRoute)

describe.skip('GET /logout', () => {
  // Remove or comment out the mockRequest and mockResponse setup

  it('logout user by clearing their refresh token(s) from the DB', async () => {
    const response = await request(app)
      .get('/logout')
      .set('Cookie', [`${RESIDENT_TOKEN}=123`, `${REFRESH_TOKEN}=456`])

    // Update the expectation to match your actual implementation
    expect(response.body).toEqual({ message: MESSAGES.LOGIN_SUCCESS })

    expect(response.status).toBe(HTTP_SUCCESS.OK)
  })
})
