import db from '../../db'
import { createUserMeta } from './createUserMeta'

jest.mock('../../utils/crypt')
jest.mock('../../db', () => ({
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      returning: jest.fn().mockImplementation(() => [{ id: 'USERID' }]),
    }),
  }),
}))

describe('createUserMeta', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a user meta record', async () => {
    const result = await createUserMeta('USERID')
    expect(result).toBe('USERID')
    expect(db.insert).toHaveBeenCalledTimes(1)
  })
})
