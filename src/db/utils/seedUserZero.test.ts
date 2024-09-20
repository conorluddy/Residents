import MESSAGES from '../../constants/messages'
import SERVICES from '../../services'
import { logger } from '../../utils/logger'
import { seedUserZero } from './seedUserZero'

jest.mock('../../utils/crypt', () => ({
  createHash: jest.fn().mockResolvedValue('hashed_password'),
}))

jest.mock('../../services/index', () => ({
  createUser: jest.fn().mockImplementation(() => '123'),
  getUserCount: jest
    .fn()
    .mockImplementationOnce(() => [{ count: 0 }])
    .mockImplementationOnce(() => [{ count: 1 }]),
}))

describe('Create the first user, assumed to be the owner.', () => {
  let exitMock: jest.SpyInstance

  beforeAll(() => {
    exitMock = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined): never => {
      throw new Error(`process.exit: ${code}`)
    })
  })
  afterAll(() => exitMock.mockRestore())

  it('should insert users into the database', async () => {
    await seedUserZero('password')
    expect(logger.error).not.toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith(MESSAGES.FIRST_USER_SEEDED)
    expect(SERVICES.createUser).toHaveBeenCalled()
  })
})
