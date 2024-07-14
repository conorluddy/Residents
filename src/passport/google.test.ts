import { User } from "../db/types"
import { googlePassport } from "./google"

jest.mock("passport")
jest.mock("passport-google-oauth20")

let fakeUser: User
jest.mock("../db", () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockImplementationOnce(async () => []),
    }),
  }),
}))

describe.skip("Google OAuth Strategy", () => {
  test("should initialize Google strategy", () => {
    expect(googlePassport.use).toHaveBeenCalled()
  })

  // Add more tests
})
