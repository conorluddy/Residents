import { SALT_ROUNDS } from "../constants/crypt"
import { createHash, validateHash } from "./crypt"
import * as bcrypt from "bcrypt"

jest.mock("bcrypt")

describe("crypt utilities", () => {
  const input = "securepassword"
  const hash = "hashedpassword"

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should hash an input correctly", async () => {
    ;(bcrypt.hash as jest.Mock).mockResolvedValue(hash)
    const result = await createHash(input)
    expect(bcrypt.hash).toHaveBeenCalledWith(input, SALT_ROUNDS)
    expect(result).toBe(hash)
  })

  it("should validate a hash correctly", async () => {
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
    const result = await validateHash(input, hash)
    expect(bcrypt.compare).toHaveBeenCalledWith(input, hash)
    expect(result).toBe(true)
  })

  it("should return false if hash validation fails", async () => {
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)
    const result = await validateHash(input, hash)
    expect(bcrypt.compare).toHaveBeenCalledWith(input, hash)
    expect(result).toBe(false)
  })
})
