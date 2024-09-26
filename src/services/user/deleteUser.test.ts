import db from '../../db'
import { BadRequestError } from '../../errors'
import { deleteUser } from './deleteUser'

jest.mock('../../db', () => ({
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementation(() => [
          {
            updatedUserId: 'USERID',
          },
        ]),
      }),
    }),
  }),
}))

describe('deleteUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should delete a user by setting their deletedAt date', async () => {
    const result = await deleteUser({ userId: 'USERID' })
    expect(result).toBe('USERID')
    expect(db.update).toHaveBeenCalledTimes(1)
  })

  it('should throw a BadRequestError if userId is missing', async () => {
    await expect(deleteUser({ userId: undefined as unknown as string })).rejects.toThrow(BadRequestError)
    expect(db.update).not.toHaveBeenCalledTimes(1)
  })
})
