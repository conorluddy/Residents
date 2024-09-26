import { createUser } from './createUser'
import db from '../../db'
import { createHash } from '../../utils/crypt'
import { EmailError, PasswordStrengthError, ValidationError } from '../../errors'
import { ROLES } from '../../constants/database'
import { makeAFakeSafeUser } from '../../test-utils/mockUsers'

jest.mock('../../utils/crypt')
jest.mock('../../db', () => ({
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      onConflictDoNothing: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementation(() => [makeAFakeSafeUser({ id: 'USERID' })]),
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

describe('createUser', () => {
  const mockUser = {
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'StrongP@ssw0rd',
    role: ROLES.DEFAULT,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a user successfully', async () => {
    const result = await createUser(mockUser)
    expect(result).toBe('USERID')
    expect(db.insert).toHaveBeenCalledTimes(1)
    expect(createHash).toHaveBeenCalledWith(mockUser.password)
  })

  it('should throw ValidationError if required fields are missing', async () => {
    const incompleteUser = { ...mockUser, username: '' }
    await expect(createUser(incompleteUser)).rejects.toThrow(ValidationError)
  })

  it('should throw PasswordStrengthError if password is weak', async () => {
    const userWithWeakPassword = { ...mockUser, password: 'weak' }
    await expect(createUser(userWithWeakPassword)).rejects.toThrow(PasswordStrengthError)
  })

  it('should throw EmailError if email is invalid', async () => {
    const userWithInvalidEmail = { ...mockUser, email: 'invalid-email' }
    await expect(createUser(userWithInvalidEmail)).rejects.toThrow(EmailError)
  })

  it('should throw EmailError if email cant be normalised', async () => {
    const userWithInvalidEmail = { ...mockUser, email: 'invalidemail@wontnormalise.com' }
    await expect(createUser(userWithInvalidEmail)).rejects.toThrow(EmailError)
  })
})
