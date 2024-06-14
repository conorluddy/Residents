const bcrypt = require("bcrypt")

export async function createHash(input: string) {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(input, saltRounds)
  return hashedPassword
}

export async function validateHash(input: string, hash: string) {
  const isValid = await bcrypt.compare(input, hash)
  return isValid
}
