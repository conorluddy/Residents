import MESSAGES from '../../constants/messages'
import db from '../../db'
import { BadRequestError } from '../../errors'
import { updateUserMeta } from './updateUserMeta'

jest.mock('../../db', () => ({
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementation(() => [{ userId: 'USERID' }]),
      }),
    }),
  }),
}))

describe('updateUserMeta', () => {
  let mockUserUpdate: { userId: string; metaItem?: string }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUserUpdate = {
      userId: 'userid',
      metaItem: 'metaItem',
    }
  })

  it('should throw a BadRequestError if userId is missing', async () => {
    mockUserUpdate.userId = null as unknown as string
    await expect(updateUserMeta(mockUserUpdate)).rejects.toThrow(new BadRequestError(MESSAGES.MISSING_USER_ID))
    expect(db.update).not.toHaveBeenCalled()
  })

  it('should throw a BadRequestError if email is invalid', async () => {
    mockUserUpdate.metaItem = undefined
    await expect(updateUserMeta(mockUserUpdate)).rejects.toThrow(
      new BadRequestError(MESSAGES.NO_METADATA_PROVIDED_FOR_UPDATE)
    )
    expect(db.update).not.toHaveBeenCalled()
  })

  it('should update the database if everything is valid', async () => {
    const result = await updateUserMeta(mockUserUpdate)
    expect(result).toBe('USERID')
    expect(db.update).toHaveBeenCalledTimes(1)
  })
})
