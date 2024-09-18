import { NextFunction, Request, Response } from 'express'
import { HTTP_SERVER_ERROR } from '../../constants/http'
import { User } from '../../db/types'
import { magicLogin } from './magicLogin'

describe.skip('Controller: Magic Login', () => {
  let mockRequest: Partial<Request> & { body: Partial<User> }
  let mockResponse: Partial<Response>
  const mockNext = jest.fn().mockReturnThis()

  beforeEach(() => {
    mockRequest = {
      body: {
        username: 'MrFake',
        email: 'mrfake@gmail.com',
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('NOT IMPLEMENTED YET: TODO', async () => {
    await magicLogin(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Not implemented yet.' })
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SERVER_ERROR.NOT_IMPLEMENTED)
  })

  it('should bomb out early if you dont provide an email address', async () => {
    delete mockRequest.body.email
    await expect(
      magicLogin(mockRequest as Request, mockResponse as Response, mockNext as NextFunction)
    ).rejects.toThrow('Email is required.')
  })
})
