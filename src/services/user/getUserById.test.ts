import MESSAGES from '../../constants/messages'
import db from '../../db'
import { BadRequestError } from '../../errors'
import { getUserById } from './getUserById'

jest.mock('../../db', () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue([{ id: 'userid' }]),
    }),
  }),
}))

describe('Services: GetUserById', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GetAllUsers', async () => {
    const result = await getUserById('resident@reside.nt')
    expect(result).toHaveProperty('id')
    expect(db.select).toHaveBeenCalledTimes(1)
  })

  it('should throw a BadRequestError if id is missing', async () => {
    await expect(getUserById(undefined as unknown as string)).rejects.toThrow(
      new BadRequestError(MESSAGES.MISSING_USER_ID)
    )
    expect(db.select).not.toHaveBeenCalled()
  })
})
