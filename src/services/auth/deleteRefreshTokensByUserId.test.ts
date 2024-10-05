import MESSAGES from '../../constants/messages'
import db from '../../db'
import { BadRequestError } from '../../errors'
import { deleteRefreshTokensByUserId } from './deleteRefreshTokensByUserId'

jest.mock('../../db', () => ({
  delete: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnValue({
      returning: jest
        .fn()
        .mockReturnValue([
          { id: 'Deleted Token 01' },
          { id: 'Deleted Token 02' },
          { id: 'Deleted Token 03' },
          { id: 'Deleted Token 04' },
          { id: 'Deleted Token 05' },
        ]),
    }),
  }),
}))

describe('Services: GetFederatedCredentials', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should delete tokens', async () => {
    const result = await deleteRefreshTokensByUserId({ userId: 'USER1' })
    expect(result).toBe(5)
    expect(db.delete).toHaveBeenCalledTimes(1)
  })

  it('should throw a BadRequestError if user ID is missing', async () => {
    await expect(deleteRefreshTokensByUserId({ userId: null as unknown as string })).rejects.toThrow(
      new BadRequestError(MESSAGES.MISSING_USER_ID)
    )
    expect(db.delete).not.toHaveBeenCalled()
  })
})
