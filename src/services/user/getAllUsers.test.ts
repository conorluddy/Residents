import { makeAFakeSafeUser } from "../../test-utils/mockUsers"
import { SafeUser } from "../../db/types"
import { getAllUsers } from "./getAllUsers"

let fakeUser: SafeUser

jest.mock("../../db", () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      limit: jest.fn().mockImplementation(async () => {
        fakeUser = makeAFakeSafeUser({ id: "USERID" })
        return [fakeUser, fakeUser, fakeUser, fakeUser]
      }),
    }),
  }),
}))

describe("Services: GetAllUsers", () => {
  it("GetAllUsers", async () => {
    const users = await getAllUsers()
    expect(users).toHaveLength(4)
  })
})
