import MESSAGES from '../../constants/messages'
import db from '../../db'
import { BadRequestError } from '../../errors'
import { getUserByEmail } from './getUserByEmail'

jest.mock('../../db', () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue([{ id: 'userid' }]),
    }),
  }),
}))

describe('Services: GetUserByEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GetAllUsers', async () => {
    const result = await getUserByEmail('resident@reside.nt')
    expect(result).toHaveProperty('id')
    expect(db.select).toHaveBeenCalledTimes(1)
  })

  it('should throw a BadRequestError if email is missing', async () => {
    await expect(getUserByEmail('')).rejects.toThrow(new BadRequestError(MESSAGES.EMAIL_REQUIRED))
    expect(db.select).not.toHaveBeenCalled()
  })

  it('should throw a BadRequestError if email is missing', async () => {
    await expect(getUserByEmail('notEmail')).rejects.toThrow(new BadRequestError(MESSAGES.INVALID_EMAIL))
    expect(db.select).not.toHaveBeenCalled()
  })
})
