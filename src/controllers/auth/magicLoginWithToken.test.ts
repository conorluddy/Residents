import { Request, Response } from 'express'
import { User } from '../../db/types'
import { magicLoginWithToken } from './magicLoginWithToken'

describe.skip('Controller: MagicLoginWithToken', () => {
  let mockRequest: Partial<Request> & { body: Partial<User> }
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = { body: { token: '123' } }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('NOT IMPLEMENTED YET: TODO', async () => {
    await expect(magicLoginWithToken(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
      'Not implemented yet.'
    )
  })
})
