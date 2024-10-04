import MESSAGES from '../../constants/messages'
import db from '../../db'
import { UserUpdate } from '../../db/types'
import { BadRequestError, PasswordStrengthError } from '../../errors'
import { updateUser } from './updateUser'

jest.mock('../../utils/crypt')
jest.mock('../../db', () => ({
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementation(() => [{ updatedUserId: 'USERID' }]),
      }),
    }),
  }),
}))

jest.mock('validator', () => ({
  ...jest.requireActual('validator'),
  normalizeEmail: jest
    .fn()
    .mockImplementationOnce(() => true)
    .mockImplementationOnce(() => false),
}))

describe('updateUser', () => {
  let mockUserUpdate: Partial<UserUpdate> & { userId: string }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUserUpdate = {
      userId: 'userid',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      password: 'StrongP@ssw0rd',
    }
  })

  it('should throw a BadRequestError if userId is missing', async () => {
    mockUserUpdate.userId = null as unknown as string
    await expect(updateUser(mockUserUpdate)).rejects.toThrow(new BadRequestError(MESSAGES.MISSING_USER_ID))
    expect(db.update).not.toHaveBeenCalled()
  })

  it('should throw a BadRequestError if email is invalid', async () => {
    mockUserUpdate.email = 'not an email'
    await expect(updateUser(mockUserUpdate)).rejects.toThrow(new BadRequestError(MESSAGES.INVALID_EMAIL))
    expect(db.update).not.toHaveBeenCalled()
  })

  it('should throw a PasswordStrength error if strength is weak', async () => {
    mockUserUpdate.password = 'password1'
    await expect(updateUser(mockUserUpdate)).rejects.toThrow(PasswordStrengthError)
    expect(db.update).not.toHaveBeenCalled()
  })

  it('should throw a BadRequestError if theres nothing passed to update with', async () => {
    await expect(updateUser({ userId: 'userid' })).rejects.toThrow(
      new BadRequestError(MESSAGES.AT_LEAST_ONE_PROPERTY_REQUIRED)
    )
    expect(db.update).not.toHaveBeenCalled()
  })

  it('should update the database if everything is valid', async () => {
    const result = await updateUser(mockUserUpdate)
    expect(result).toBe('USERID')
    expect(db.update).toHaveBeenCalledTimes(1)
  })
})
