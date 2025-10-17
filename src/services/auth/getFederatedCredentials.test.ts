import { Profile } from 'passport'
import MESSAGES from '../../constants/messages'
import db from '../../db'
import { getFederatedCredentials } from './getFederatedCredentials'

jest.mock('../../db', () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue([{ userId: 'FederatedCredentialsId' }]),
    }),
  }),
}))

describe('Services: GetFederatedCredentials', () => {
  const mockProvider = 'Poogle'
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should get federated credentials', async () => {
    const result = await getFederatedCredentials({ provider: 'Google', profileId: 'pid' })
    expect(result).toBe('FederatedCredentialsId')
    expect(db.select).toHaveBeenCalledTimes(1)
  })

  it('should throw a BadRequestError if provider is missing', async () => {
    await expect(
      getFederatedCredentials({ profileId: '123', provider: null as unknown as Profile['provider'] })
    ).rejects.toThrow(MESSAGES.MISSING_PASSPORT_PROVIDER)
    expect(db.select).not.toHaveBeenCalled()
  })

  it('should throw a BadRequestError if profile ID is missing', async () => {
    await expect(
      getFederatedCredentials({ profileId: null as unknown as string, provider: mockProvider })
    ).rejects.toThrow(MESSAGES.MISSING_PASSPORT_PROFILE_ID)
    expect(db.select).not.toHaveBeenCalled()
  })
})
