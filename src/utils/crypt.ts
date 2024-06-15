import { SALT_ROUNDS } from "../constants/crypt"

const bcrypt = require("bcrypt")

export async function createHash(input: string) {
  return await bcrypt.hash(input, SALT_ROUNDS)
}

export async function validateHash(input: string, hash: string) {
  try {
    return await bcrypt.compare(input, hash)
  } catch {
    return false
  }
}
