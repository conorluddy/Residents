import { SALT_ROUNDS } from '../constants/crypt'
import * as bcrypt from 'bcrypt'

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
  password += upperCase[Math.floor(Math.random() * upperCase.length)]
  password += lowerCase[Math.floor(Math.random() * lowerCase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  // Fill
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  // Shuffle
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
}
