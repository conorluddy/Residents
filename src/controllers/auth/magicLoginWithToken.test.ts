import { Response } from 'express'
import { User } from '../../db/types'
import { magicLoginWithToken } from './magicLoginWithToken'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

describe.skip('Controller: MagicLoginWithToken', () => {
  let mockRequest: Partial<ResidentRequest> & { body: Partial<User> }
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = { body: { token: '123' } }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('NOT IMPLEMENTED YET: TODO', async () => {
    await expect(magicLoginWithToken(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.FEATURE_NOT_IMPLEMENTED
    )
  })
})
