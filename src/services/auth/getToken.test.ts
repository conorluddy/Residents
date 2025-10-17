import MESSAGES from '../../constants/messages'
import db from '../../db'
import { getToken } from './getToken'

jest.mock('../../db', () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        orderBy: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue([{ id: 'Tokenid' }]),
        }),
      }),
    }),
  }),
}))

describe('Services: GetToken', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GetToken', async () => {
    const result = await getToken({ tokenId: 'resident@reside.nt' })
    expect(result).toHaveProperty('id')
    expect(db.select).toHaveBeenCalledTimes(1)
  })

  it('should throw a BadRequestError if id is missing', async () => {
    await expect(getToken({ tokenId: null as unknown as string })).rejects.toThrow(
      MESSAGES.NO_TOKEN_ID_PROVIDED
    )
    expect(db.select).not.toHaveBeenCalled()
  })
})
