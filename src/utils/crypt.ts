import { SALT_ROUNDS } from '../constants/crypt'
import * as bcrypt from 'bcrypt'

export async function createHash(input: string): Promise<string> {
  return await bcrypt.hash(input, SALT_ROUNDS)
}

export async function validateHash(input: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(input, hash)
}
