import { Response } from 'express'
import { HTTP_SUCCESS } from '../../constants/http'
import { updateUserMeta } from './updateUserMeta'
import { logger } from '../../utils/logger'
import { REQUEST_TARGET_USER_ID } from '../../types/requestSymbols'
import MESSAGES from '../../constants/messages'
import { ResidentRequest } from '../../types'

const FAKEID = '123'

jest.mock('../../services/index', () => ({
  updateUserMeta: jest.fn().mockImplementationOnce(() => FAKEID),
}))

describe('Controller: UpdateUserMeta', () => {
  let mockRequest: Partial<ResidentRequest> & { params: { id?: string }; [REQUEST_TARGET_USER_ID]?: string }
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {
      params: { id: 'ID' },
      [REQUEST_TARGET_USER_ID]: 'ID',
      body: { metaItem: 'UpdatedMetaItemData' },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('Successfully updates user meta', async () => {
    await updateUserMeta(mockRequest as ResidentRequest, mockResponse as Response)
    expect(logger.error).not.toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_SUCCESS.OK)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: MESSAGES.USER_META_UPDATED })
  })

  it('Responds with Bad Request when IDs are missing', async () => {
    mockRequest.params = { ...mockRequest.params!, id: '' }
    await expect(updateUserMeta(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.MISSING_USER_ID
    )
  })

  it('Responds with Forbidden if ID and verified target ID dont match', async () => {
    mockRequest.params = { ...mockRequest.params!, id: 'NotTheFakerUsersID' }
    await expect(updateUserMeta(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.USER_ID_MISMATCH
    )
  })

  it('Responds with Bad Request if no update data is provided', async () => {
    mockRequest.body = {}
    await expect(updateUserMeta(mockRequest as ResidentRequest, mockResponse as Response)).rejects.toThrow(
      MESSAGES.NO_UPDATE_DATA
    )
  })
})
