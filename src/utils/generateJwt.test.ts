import { ROLES, STATUS } from "../constants/database"
import { PublicUser } from "../db/types"
import { generateJwt } from "./generateJwt"
import jwt from "jsonwebtoken"
jest.mock("jsonwebtoken")

describe("generateJwt", () => {
  const userPayload: PublicUser = {
    id: "1",
    firstName: "John",
    lastName: "Dope",
    email: "john.dope@example.com",
    username: "johndope",
    role: ROLES.DEFAULT,
  }

  it("should generate a JWT with the correct payload and options", () => {
    const signSpy = jest.spyOn(jwt, "sign") as jest.MockedFunction<typeof jwt.sign>
    signSpy.mockReturnValue("testtoken" as any)
    const token = generateJwt(userPayload)
    expect(token).toBe("testtoken")
  })
})
