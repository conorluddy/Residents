import MESSAGES from '../../constants/messages'
import db from '../../db'
import { LoginError } from '../../errors'
import { createFederatedCredentials } from './createFederatedCredentials'

jest.mock('../../db', () => ({
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      onConflictDoNothing: jest.fn().mockReturnValue({
        returning: jest
          .fn()
          .mockReturnValueOnce([{ userId: 'USERID' }])
          .mockReturnValueOnce([]),
      }),
    }),
  }),
}))

describe('Create Federated Credentials', () => {
  const mockFederatedCredentials = {
    userId: 'UserId1',
    provider: 'Noogle',
    profileId: '123',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create federated credentials successfully', async () => {
    const result = await createFederatedCredentials(mockFederatedCredentials)
    expect(result).toBe('USERID')
    expect(db.insert).toHaveBeenCalledTimes(1)
  })

  it('should error if userId is missing', async () => {
    const incompleteFederatedCredentials = { ...mockFederatedCredentials, userId: null as unknown as string }
    await expect(createFederatedCredentials(incompleteFederatedCredentials)).rejects.toThrow(
      new LoginError(MESSAGES.MISSING_PASSPORT_USER_ID)
    )
  })

  it('should error if provider is missing', async () => {
    const incompleteFederatedCredentials = { ...mockFederatedCredentials, provider: null as unknown as string }
    await expect(createFederatedCredentials(incompleteFederatedCredentials)).rejects.toThrow(
      new LoginError(MESSAGES.MISSING_PASSPORT_PROVIDER)
    )
  })

  it('should error if profileId is missing', async () => {
    const incompleteFederatedCredentials = { ...mockFederatedCredentials, profileId: null as unknown as string }
    await expect(createFederatedCredentials(incompleteFederatedCredentials)).rejects.toThrow(
      new LoginError(MESSAGES.MISSING_PASSPORT_PROFILE_ID)
    )
  })

  it('should error if federateddCredentials werent created', async () => {
    await expect(createFederatedCredentials(mockFederatedCredentials)).rejects.toThrow(
      new LoginError(MESSAGES.FEDERATED_CREDENTIALS_NOT_CREATED)
    )
  })
})
