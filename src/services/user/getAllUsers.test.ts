import { makeAFakeSafeUser } from '../../test-utils/mockUsers'
import { SafeUser } from '../../db/types'
import { getAllUsers } from './getAllUsers'

let fakeUser: SafeUser

jest.mock('../../db', () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      orderby: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          offset: jest.fn().mockReturnValue(() => {
            fakeUser = makeAFakeSafeUser({ id: 'USERID' })
            return [fakeUser, fakeUser, fakeUser, fakeUser]
          }),
        }),
      }),
    }),
  }),
}))

describe.skip('Services: GetAllUsers', () => {
  it('GetAllUsers', async () => {
    const users = await getAllUsers()
    expect(users).toHaveLength(4)
  })
})
