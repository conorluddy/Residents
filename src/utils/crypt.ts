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
  password += upperCase[getRandomIndex(upperCase.length)]
  password += lowerCase[getRandomIndex(lowerCase.length)]
  password += numbers[getRandomIndex(numbers.length)]
  password += symbols[getRandomIndex(symbols.length)]
  // Fill
  for (let i = password.length; i < length; i++) {
    password += allChars[getRandomIndex(allChars.length)]
  }
  // Shuffle
  return password
    .split('')
    .sort(() => 0.5 - (getRandomIndex(256) / 256))
    .join('')
}

function getRandomIndex(max: number): number {
  let randomNumber;
  const limit = 256 - (256 % max);
  do {
    randomNumber = randomBytes(1)[0];
  } while (randomNumber >= limit);
  return randomNumber % max;
}
