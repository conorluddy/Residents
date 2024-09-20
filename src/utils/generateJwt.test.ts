import { ROLES } from '../constants/database'
import { PublicUser } from '../db/types'
import jwt from 'jsonwebtoken'
import { generateJwtFromUser } from './generateJwt'
jest.mock('jsonwebtoken')

describe('generateJwtFromUser', () => {
  const userPayload: PublicUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Dope',
    email: 'john.dope@example.com',
    username: 'johndope',
    role: ROLES.DEFAULT,
  }

  it('should generate a JWT with the correct payload and options', () => {
    const signSpy = jest.spyOn(jwt, 'sign') as jest.MockedFunction<typeof jwt.sign>
    signSpy.mockImplementation(() => 'testtoken')
    const token = generateJwtFromUser(userPayload)
    expect(token).toBe('testtoken')
  })
})
