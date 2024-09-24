import { SALT_ROUNDS } from '../constants/crypt'
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

export async function createHash(input: string): Promise<string> {
  return await bcrypt.hash(input, SALT_ROUNDS)
}

export async function validateHash(input: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(input, hash)
}

export function generatePassword(length: number = 16): string {
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const allChars = upperCase + lowerCase + numbers + symbols
  let password = ''
  // Ensure at least one of each required type
  password += upperCase[randomBytes(1)[0] % upperCase.length]
  password += lowerCase[randomBytes(1)[0] % lowerCase.length]
  password += numbers[randomBytes(1)[0] % numbers.length]
  password += symbols[randomBytes(1)[0] % symbols.length]
  // Fill
  for (let i = password.length; i < length; i++) {
    password += allChars[randomBytes(1)[0] % allChars.length]
  }
  // Shuffle
  return password
    .split('')
    .sort(() => 0.5 - (randomBytes(1)[0] / 256))
    .join('')
}
