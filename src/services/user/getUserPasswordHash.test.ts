import MESSAGES from '../../constants/messages'
import db from '../../db'
import { BadRequestError } from '../../errors'
import { getUserPasswordHash } from './getUserPasswordHash'

jest.mock('../../db', () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue([{ password: 'p455wrrrd' }]),
    }),
  }),
}))

describe('Services: GetUserPasswordHash', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GetAllUsers', async () => {
    const result = await getUserPasswordHash('id')
    expect(result).toBe('p455wrrrd')
    expect(db.select).toHaveBeenCalledTimes(1)
  })

  it('should throw a BadRequestError if id is missing', async () => {
    await expect(getUserPasswordHash(undefined as unknown as string)).rejects.toThrow(
      new BadRequestError(MESSAGES.NO_ID_PROVIDED)
    )
    expect(db.select).not.toHaveBeenCalled()
  })
})
