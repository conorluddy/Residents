import { NextFunction, Response } from 'express'
import { TOKEN_TYPE } from '../../constants/database'
import { TIMESPAN } from '../../constants/time'
import { Token } from '../../db/types'
import { REQUEST_TOKEN, REQUEST_TOKEN_ID } from '../../types/requestSymbols'
import findValidTokenById from './findValidTokenById'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

jest.mock('../../services/index', () => ({
  getToken: jest
    .fn()
    .mockReturnValueOnce({
      id: 'XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX',
      type: TOKEN_TYPE.MAGIC,
      used: false,
      createdAt: new Date(),
      expiresAt: new Date().setFullYear(new Date().getFullYear() + 1),
    })
    .mockReturnValueOnce({
      id: 'XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX',
      type: TOKEN_TYPE.MAGIC,
      used: true,
      createdAt: new Date(),
      expiresAt: new Date().setFullYear(new Date().getFullYear() + 1),
    })
    .mockReturnValueOnce({
      id: 'XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX',
      type: TOKEN_TYPE.MAGIC,
      used: false,
      createdAt: new Date(),
      expiresAt: new Date(),
    }),
}))

describe('Middleware:findValidTokenById', () => {
  let mockRequest: Partial<ResidentRequest> & { [REQUEST_TOKEN_ID]: string; [REQUEST_TOKEN]: Token }
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      [REQUEST_TOKEN_ID]: 'XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX',
      [REQUEST_TOKEN]: {
        id: 'XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX',
        userId: 'UUU-UUU-UUU-UUU-UUU-UUU-UUU-UUU',
        type: TOKEN_TYPE.VALIDATE,
        used: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + TIMESPAN.HOUR),
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it('Happy path: Find valid token in DB', async () => {
    await findValidTokenById(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    expect(mockRequest[REQUEST_TOKEN_ID]).toEqual('XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX')
    expect(nextFunction).toHaveBeenCalled()
  })

  it('ValidatedToken does not exist in the request, return bad request', async () => {
    mockRequest[REQUEST_TOKEN_ID] = undefined as unknown as string
    await expect(
      findValidTokenById(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    ).rejects.toThrow(MESSAGES.VALID_TOKEN_REQUIRED)
  })

  it('Token is flagged as used, return forbidden', async () => {
    await expect(
      findValidTokenById(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    ).rejects.toThrow(MESSAGES.TOKEN_USED)
  })

  it('Token has expired, return forbidden', async () => {
    await expect(
      findValidTokenById(mockRequest as ResidentRequest, mockResponse as Response, nextFunction)
    ).rejects.toThrow(MESSAGES.TOKEN_EXPIRED)
  })
})
