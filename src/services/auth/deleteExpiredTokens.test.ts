import db from '../../db'
import { deleteExpiredTokens } from './deleteExpiredTokens'

jest.mock('../../db', () => ({
  delete: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnValue({
      returning: jest
        .fn()
        .mockReturnValue([{ id: 'Deleted Token 01' }, { id: 'Deleted Token 02' }, { id: 'Deleted Token 03' }]),
    }),
  }),
}))

describe('Services: GetFederatedCredentials', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should delete expired tokens', async () => {
    const result = await deleteExpiredTokens()
    expect(result).toBe(3)
    expect(db.delete).toHaveBeenCalledTimes(1)
  })
})
