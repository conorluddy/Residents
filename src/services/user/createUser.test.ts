import { makeAFakeSafeUser } from '../../test-utils/mockUsers'
import { NewUser, User } from '../../db/types'
import { createUser } from './createUser'
import { ROLES } from '../../constants/database'

let fakeUser: Partial<User>

jest.mock('../../utils/logger')
jest.mock('../../db', () => ({
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      onConflictDoNothing: jest.fn().mockReturnValue({
        returning: jest.fn().mockImplementation(() => {
          fakeUser = makeAFakeSafeUser({ id: 'USERID' })
          return [fakeUser]
        }),
      }),
    }),
  }),
}))

describe('Services: CreateUser', () => {
  it('Happy path', async () => {
    const userId = await createUser({
      username: 'FakeUser',
      firstName: 'Fake',
      lastName: 'User',
      email: 'create@user.com',
      password: '$TR0ngP@$$W0rDz123!',
      role: ROLES.DEFAULT,
    })
    expect(userId).toBe(fakeUser.id)
  })

  it('Missing required data', async () => {
    await expect(createUser({} as NewUser)).rejects.toThrow('Missing required fields.')
  })
})
