import db from '../../db'
import { getUserCount } from './getUserCount'

jest.mock('../../db', () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue([{ count: 3 }]),
  }),
}))

describe('Services: GetUserCount', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GetAllUsers', async () => {
    const result = await getUserCount()
    expect(result).toBe(3)
    expect(db.select).toHaveBeenCalledTimes(1)
  })
})
