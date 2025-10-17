import MESSAGES from '../../constants/messages'
import db from '../../db'
import { PasswordStrengthError } from '../../errors'
import { updateUserPassword } from './updateUserPassword'

jest.mock('../../db', () => ({
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementation(() => [{ updatedUserId: 'USERID' }]),
      }),
    }),
  }),
}))

describe('updateUserPassword', () => {
  let mockUserUpdate: { userId: string; password?: string }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUserUpdate = {
      userId: 'userid',
      password: 'This15TheT35tp4$$W0rD?',
    }
  })

  it('should throw a BadRequestError if userId is missing', async () => {
    mockUserUpdate.userId = null as unknown as string
    await expect(updateUserPassword(mockUserUpdate)).rejects.toThrow(MESSAGES.MISSING_USER_ID)
    expect(db.update).not.toHaveBeenCalled()
  })

  it('should throw a BadRequestError if password is missing', async () => {
    mockUserUpdate.password = undefined
    await expect(updateUserPassword(mockUserUpdate)).rejects.toThrow(MESSAGES.PASSWORD_NEEDED)
    expect(db.update).not.toHaveBeenCalled()
  })

  it('should throw a PasswordStrength error if strength is weak', async () => {
    mockUserUpdate.password = 'password1'
    await expect(updateUserPassword(mockUserUpdate)).rejects.toThrow(PasswordStrengthError)
    expect(db.update).not.toHaveBeenCalled()
  })

  it('should update the database if everything is valid', async () => {
    const result = await updateUserPassword(mockUserUpdate)
    expect(result).toBe('USERID')
    expect(db.update).toHaveBeenCalledTimes(1)
  })
})
