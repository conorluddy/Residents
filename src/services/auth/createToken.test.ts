import { TOKEN_TYPE } from '../../constants/database'
import MESSAGES from '../../constants/messages'
import db from '../../db'
import { createToken, TOKEN_TYPE_EXPIRATION_MAP } from './createToken'

jest.mock('../../utils/crypt')
jest.mock('../../db', () => ({
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      returning: jest.fn().mockImplementation(() => [{ id: 'USERID' }]),
    }),
  }),
}))

describe('createToken', () => {
  const mockToken = {
    userId: 'UserId1',
    type: TOKEN_TYPE.MAGIC,
    expiry: TOKEN_TYPE_EXPIRATION_MAP.magic,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a token successfully', async () => {
    const result = await createToken(mockToken)
    expect(result).toBe('USERID')
    expect(db.insert).toHaveBeenCalledTimes(1)
  })

  it('should throw TokenError if user ID is missing', async () => {
    const incompleteToken = { ...mockToken, userId: null as unknown as string }
    await expect(createToken(incompleteToken)).rejects.toThrow(MESSAGES.TOKEN_REQUIRES_USER_ID)
  })

  it('should throw TokenError if token type is missing', async () => {
    const incompleteToken = { ...mockToken, type: null as unknown as TOKEN_TYPE }
    await expect(createToken(incompleteToken)).rejects.toThrow(MESSAGES.TOKEN_TYPE_REQUIRED)
  })

  it('should throw TokenError if token type is missing', async () => {
    const incompleteToken = { ...mockToken, type: 'HACKERTOKEN' as unknown as TOKEN_TYPE }
    await expect(createToken(incompleteToken)).rejects.toThrow(MESSAGES.TOKEN_TYPE_INVALID)
  })
})
