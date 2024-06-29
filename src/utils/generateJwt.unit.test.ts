import { ROLES } from "../constants/user"
import { generateJwt, JWTUserPayload } from "./generateJwt"
import jwt from "jsonwebtoken"
jest.mock("jsonwebtoken")

process.env.JWT_TOKEN_SECRET = "testsecret"
process.env.JWT_TOKEN_EXPIRY = "1m"

describe("generateJwt", () => {
  const userPayload: JWTUserPayload = {
    id: "13",
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
    expect(signSpy).toHaveBeenCalledWith(userPayload, "testsecret", {
      expiresIn: "1m",
    })
    expect(token).toBe("testtoken")
  })

  it("should throw an error if JWT secret is not found", () => {
    delete process.env.JWT_TOKEN_SECRET
    expect(() => generateJwt(userPayload)).toThrow("JWT secret not found")
    // Restore the JWT token secret for other tests
    process.env.JWT_TOKEN_SECRET = "testsecret"
  })

  it("should use the default expiry time if JWT_TOKEN_EXPIRY is not set", () => {
    delete process.env.JWT_TOKEN_EXPIRY
    const signSpy = jest.spyOn(jwt, "sign") as jest.MockedFunction<typeof jwt.sign>
    signSpy.mockReturnValue("testtoken" as any)
    generateJwt(userPayload)
    expect(signSpy).toHaveBeenCalledWith(
      userPayload,
      "testsecret",
      { expiresIn: "1m" } // Default expiry time
    )
    // Restore the JWT token expiry for other tests
    process.env.JWT_TOKEN_EXPIRY = "1m"
  })
})
