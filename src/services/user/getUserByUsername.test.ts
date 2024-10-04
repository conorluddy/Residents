import MESSAGES from '../../constants/messages'
import db from '../../db'
import { BadRequestError } from '../../errors'
import { getUserByUsername } from './getUserByUsername'

jest.mock('../../db', () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue([{ id: 'userid' }]),
    }),
  }),
}))

describe('Services: GetUserByUsername', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GetAllUsers', async () => {
    const result = await getUserByUsername('resident@reside.nt')
    expect(result).toHaveProperty('id')
    expect(db.select).toHaveBeenCalledTimes(1)
  })

  it('should throw a BadRequestError if id is missing', async () => {
    await expect(getUserByUsername(undefined as unknown as string)).rejects.toThrow(
      new BadRequestError(MESSAGES.USERNAME_REQUIRED)
    )
    expect(db.select).not.toHaveBeenCalled()
  })
})
