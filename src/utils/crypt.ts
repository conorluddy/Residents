import { SALT_ROUNDS } from '../constants/crypt'
import * as bcrypt from 'bcrypt'

export async function createHash(input: string) {
  return await bcrypt.hash(input, SALT_ROUNDS)
}

export async function validateHash(input: string, hash: string) {
  return await bcrypt.compare(input, hash)
}
