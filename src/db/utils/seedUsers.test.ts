import { createRandomUsers, seedUsers } from './seedUsers'
import SERVICES from '../../services'

jest.mock('../../utils/crypt', () => ({
  createHash: jest.fn().mockResolvedValue('hashed_password'),
}))

describe('createRandomUsers', () => {
  let exitMock: jest.SpyInstance
  let createMock: jest.SpyInstance

  beforeAll(() => {
    exitMock = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined): never => {
      throw new Error(`process.exit: ${code}`)
    })
  })
  afterAll(() => exitMock.mockRestore())

  beforeEach(() => {
    createMock = jest.spyOn(SERVICES, 'createUser')
  })

  afterEach(() => {
    createMock.mockRestore()
  })

  it('should create the specified amount of users', async () => {
    const amount = 10
    const users = await createRandomUsers(amount)
    expect(users).toHaveLength(amount)
    users.forEach((user) => {
      expect(user).toHaveProperty('username')
      expect(user).toHaveProperty('password', 'hashed_password')
      expect(user).toHaveProperty('firstName')
      expect(user).toHaveProperty('lastName')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('role')
      expect(user).toHaveProperty('status')
      expect(user).toHaveProperty('deletedAt')
    })
  })

  it('should insert users into the database', async () => {
    await seedUsers(2)
    expect(SERVICES.createUser).toHaveBeenCalled()
  })
})
