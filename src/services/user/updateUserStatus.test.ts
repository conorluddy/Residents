import { STATUS } from '../../constants/database'
import MESSAGES from '../../constants/messages'
import db from '../../db'
import { updateUserStatus } from './updateUserStatus'

jest.mock('../../db', () => ({
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementation(() => [{ updatedUserId: 'USERID' }]),
      }),
    }),
  }),
}))

describe('updateUserStatus', () => {
  let mockUserUpdate: { userId: string; status: STATUS }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUserUpdate = {
      userId: 'userid',
      status: STATUS.VERIFIED,
    }
  })

  it('should throw a BadRequestError if userId is missing', async () => {
    mockUserUpdate.userId = null as unknown as string
    await expect(updateUserStatus(mockUserUpdate)).rejects.toThrow(MESSAGES.MISSING_USER_ID)
    expect(db.update).not.toHaveBeenCalled()
  })

  it('should throw a BadRequestError if status is missing', async () => {
    mockUserUpdate.status = null as unknown as STATUS
    await expect(updateUserStatus(mockUserUpdate)).rejects.toThrow(MESSAGES.STATUS_REQUIRED)
    expect(db.update).not.toHaveBeenCalled()
  })

  it('should update the database if everything is valid', async () => {
    const result = await updateUserStatus(mockUserUpdate)
    expect(result).toBe('USERID')
    expect(db.update).toHaveBeenCalledTimes(1)
  })
})
