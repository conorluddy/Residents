import { Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import MESSAGES from '../../constants/messages'
import { ResidentRequest, ResidentResponse } from '../../types'
import { deleteExpiredTokens } from './deleteExpiredTokens'

jest.mock('../../services/index', () => ({
  deleteExpiredTokens: jest.fn().mockImplementation(() => 100),
}))

describe('Controller: Delete Expired Tokens', () => {
  let mockRequest: Partial<ResidentRequest>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
  })

  it('logs out a user by deleting any of their refresh tokens', async () => {
    await deleteExpiredTokens(mockRequest as ResidentRequest, mockResponse as Response<ResidentResponse>)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: `100 ${MESSAGES.EXPIRED_TOKENS_DELETED}` })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
  })
})
