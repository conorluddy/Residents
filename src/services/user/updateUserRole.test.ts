import { ROLES } from '../../constants/database'
import MESSAGES from '../../constants/messages'
import db from '../../db'
import { BadRequestError } from '../../errors'
import { updateUserRole } from './updateUserRole'

jest.mock('../../db', () => ({
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementation(() => [{ updatedUserId: 'USERID' }]),
      }),
    }),
  }),
}))

describe('updateUserRole', () => {
  let mockUserUpdate: { userId: string; role: ROLES }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUserUpdate = {
      userId: 'userid',
      role: ROLES.LOCKED,
    }
  })

  it('should throw a BadRequestError if userId is missing', async () => {
    mockUserUpdate.userId = null as unknown as string
    await expect(updateUserRole(mockUserUpdate)).rejects.toThrow(new BadRequestError(MESSAGES.MISSING_USER_ID))
    expect(db.update).not.toHaveBeenCalled()
  })

  it('should throw a BadRequestError if role is missing', async () => {
    mockUserUpdate.role = null as unknown as ROLES
    await expect(updateUserRole(mockUserUpdate)).rejects.toThrow(new BadRequestError(MESSAGES.ROLE_REQUIRED))
    expect(db.update).not.toHaveBeenCalled()
  })

  it('should update the database if everything is valid', async () => {
    const result = await updateUserRole(mockUserUpdate)
    expect(result).toBe('USERID')
    expect(db.update).toHaveBeenCalledTimes(1)
  })
})
