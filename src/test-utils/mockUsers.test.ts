// import { makeAFakeUser, makeAFakeUserWithHashedPassword } from "../path/to/your/module"
import { ROLES, STATUS } from '../constants/database'
import { validateHash } from '../utils/crypt'
import { makeAFakeUser, makeAFakeUserWithHashedPassword } from './mockUsers'

describe('makeAFakeUser', () => {
  it('should create a user with default values', () => {
    const user = makeAFakeUser({})
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('firstName')
    expect(user).toHaveProperty('lastName')
    expect(user).toHaveProperty('password')
    expect(user).toHaveProperty('role')
    expect(user).toHaveProperty('status')
    expect(user).toHaveProperty('username')
    expect(user).toHaveProperty('createdAt')
    expect(user.deletedAt).toBeNull()
  })

  it('should allow overriding default values', () => {
    const customValues = {
      id: 'customId',
      email: 'custom@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'customPassword',
      rank: 10,
      role: ROLES.ADMIN,
      status: STATUS.UNVERIFIED,
      username: 'customUsername',
    }
    const user = makeAFakeUser(customValues)

    expect(user.id).toBe(customValues.id)
    expect(user.email).toBe(customValues.email)
    expect(user.firstName).toBe(customValues.firstName)
    expect(user.lastName).toBe(customValues.lastName)
    expect(user.password).toBe(customValues.password)
    expect(user.role).toBe(customValues.role)
    expect(user.status).toBe(customValues.status)
    expect(user.username).toBe(customValues.username)
  })
})

describe('makeAFakeUserWithHashedPassword', () => {
  it('should create a user with a hashed password', async () => {
    const user = await makeAFakeUserWithHashedPassword({})

    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('firstName')
    expect(user).toHaveProperty('lastName')
    expect(user).toHaveProperty('password')
    expect(user).toHaveProperty('role')
    expect(user).toHaveProperty('status')
    expect(user).toHaveProperty('username')
    expect(user).toHaveProperty('createdAt')
    expect(user.deletedAt).toBeNull()

    const isPasswordHashed = user.password && (await validateHash(user.username, user.password))
    expect(isPasswordHashed).toBe(true)
  })

  it('should allow overriding default values', async () => {
    const customValues = {
      id: 'customId',
      email: 'custom@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'customPassword',
      rank: 10,
      role: ROLES.ADMIN,
      status: STATUS.UNVERIFIED,
      username: 'customUsername',
    }
    const user = await makeAFakeUserWithHashedPassword(customValues)

    expect(user.id).toBe(customValues.id)
    expect(user.email).toBe(customValues.email)
    expect(user.firstName).toBe(customValues.firstName)
    expect(user.lastName).toBe(customValues.lastName)
    expect(user.role).toBe(customValues.role)
    expect(user.status).toBe(customValues.status)
    expect(user.username).toBe(customValues.username)

    const isPasswordHashed = user.password && (await validateHash(customValues.password, user.password))
    expect(isPasswordHashed).toBe(true)
  })
})
