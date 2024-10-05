import MESSAGES from '../../constants/messages'
import db from '../../db'
import { BadRequestError } from '../../errors'
import { deleteAllUserTokens } from './deleteAllUserTokens'

jest.mock('../../db', () => ({
  delete: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnValue({
      returning: jest.fn().mockReturnValue([{ id: 'Deleted Token 01' }, { id: 'Deleted Token 03' }]),
    }),
  }),
}))

describe('Services: GetFederatedCredentials', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should delete tokens', async () => {
    const result = await deleteAllUserTokens({ userId: 'USER1' })
    expect(result).toBe(2)
    expect(db.delete).toHaveBeenCalledTimes(1)
  })

  it('should throw a BadRequestError if user ID is missing', async () => {
    await expect(deleteAllUserTokens({ userId: null as unknown as string })).rejects.toThrow(
      new BadRequestError(MESSAGES.MISSING_USER_ID)
    )
    expect(db.delete).not.toHaveBeenCalled()
  })
})
