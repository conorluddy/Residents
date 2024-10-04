import { ROLES, STATUS } from '../../constants/database'
import { getAllUsers } from './getAllUsers'

jest.mock('../../db', () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        orderBy: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            offset: jest
              .fn()
              .mockResolvedValue([{ id: 'USERID' }, { id: 'USERID' }, { id: 'USERID' }, { id: 'USERID' }]),
          }),
        }),
      }),
    }),
  }),
}))

describe('Services: GetAllUsers', () => {
  it('GetAllUsers', async () => {
    const users = await getAllUsers({
      firstName: 'xx',
      lastName: 'xx',
      email: 'email@mail.e',
      username: 'test',
      role: ROLES.DEFAULT,
      status: STATUS.VERIFIED,
      offset: 0,
      limit: 10,
    })
    expect(users).toHaveLength(4)
  })
})
