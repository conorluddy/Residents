import { makeAFakeSafeUser } from "../../test-utils/mockUsers"
import { getUserByID } from "./getUser"
import { User } from "../../db/types"
import { logger } from "../../utils/logger"

let fakeUser: Partial<User>

jest.mock("../../utils/logger")

jest.mock("../../db", () => ({
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockImplementation(async () => {
        fakeUser = makeAFakeSafeUser({ id: "USERID" })
        return [fakeUser]
      }),
    }),
  }),
}))

describe("Services: GetUser", () => {
  it("GetUserByID", async () => {
    const user = await getUserByID("X")
    expect(user).toBe(fakeUser)
  })

  it("GetUserByID: Missing ID", async () => {
    await expect(getUserByID(undefined as unknown as string)).rejects.toThrow("Error getting user by ID")
    expect(logger.error).toHaveBeenCalledWith("Error getting user by ID", expect.any(Error))
  })
})
