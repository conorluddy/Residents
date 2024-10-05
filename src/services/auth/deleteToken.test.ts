import MESSAGES from '../../constants/messages'
import db from '../../db'
import { BadRequestError } from '../../errors'
import { deleteToken } from './deleteToken'

jest.mock('../../db', () => ({
  delete: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnValue({
      returning: jest.fn().mockReturnValue([{ id: 'TOK1' }]),
    }),
  }),
}))

describe('Services: GetFederatedCredentials', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should delete token by ID', async () => {
    const result = await deleteToken({ tokenId: 'TOK1' })
    expect(result).toBe('TOK1')
    expect(db.delete).toHaveBeenCalledTimes(1)
  })

  it('should throw a BadRequestError if token ID is missing', async () => {
    await expect(deleteToken({ tokenId: null as unknown as string })).rejects.toThrow(
      new BadRequestError(MESSAGES.NO_TOKEN_ID_PROVIDED)
    )
    expect(db.delete).not.toHaveBeenCalled()
  })
})
