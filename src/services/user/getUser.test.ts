import { Request, Response } from "express"
import { makeAFakeUser } from "../../test-utils/mockUsers"
import { HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constants/http"
import { User } from "../../db/types"
import { getUserByID } from "./getUser"

let fakeUser: Partial<User>

jest.mock("../../utils/logger")
jest.mock("../../db", () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest
        .fn()
        .mockImplementationOnce(async () => {
          fakeUser = makeAFakeUser({ id: "123" })
          return fakeUser
        })
        .mockImplementationOnce(async () => {
          return undefined
        })
        .mockImplementationOnce(async () => {
          throw new Error("DB error")
        }),
    }),
  }),
}))

describe("Controller: GetUser", () => {
  beforeAll(() => {})
  beforeEach(() => {})

  it("Happy path", async () => {
    const user = await getUserByID("123")
    expect(user).toBe(fakeUser)
  })
})
