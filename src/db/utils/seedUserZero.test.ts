import SERVICES from "../../services"
import { logger } from "../../utils/logger"
import { seedUserZero } from "./seedUserZero"

jest.mock("../../utils/crypt", () => ({
  createHash: jest.fn().mockResolvedValue("hashed_password"),
}))

jest.mock("../../db", () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      execute: jest
        .fn()
        .mockImplementationOnce(async () => [{ count: 0 }])
        .mockImplementationOnce(async () => [{ count: 1 }]),
    }),
  }),
}))

jest.mock("../../services/index", () => ({
  createUser: jest.fn().mockImplementation(async () => "123"),
}))

describe("Create the first user, assumed to be the owner.", () => {
  let exitMock: jest.SpyInstance

  beforeAll(() => {
    exitMock = jest.spyOn(process, "exit").mockImplementation((code?: string | number | null | undefined): never => {
      throw new Error(`process.exit: ${code}`)
    })
  })
  afterAll(() => exitMock.mockRestore())

  it("should insert users into the database", async () => {
    await seedUserZero("password")
    expect(SERVICES.createUser).toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith("First user seeded with Owner role.")
  })
})
