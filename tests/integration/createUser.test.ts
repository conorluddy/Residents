import request from 'supertest'
import { app } from '../../src'
import { postgresDatabaseClient } from '../../src/db'
import { ROLES } from '../../src/constants/database'
import MESSAGES from '../../src/constants/messages'

describe('Integration: Can CreateUser', () => {
  beforeAll(async () => {
    await postgresDatabaseClient.connect()
    await postgresDatabaseClient.query('BEGIN') // Transaction
  })
  beforeEach(async () => await postgresDatabaseClient.query('DELETE FROM users'))
  afterAll(async () => {
    await postgresDatabaseClient.query('ROLLBACK') // Rollback the transaction
    await postgresDatabaseClient.end()
  })

  it('should create a new user successfully', async () => {
    const newUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@resi.dents',
      username: 'mr.test',
      password: 'STRONGP4$$w0rd_',
      role: ROLES.ADMIN,
    }
    const response = await request(app).post('/users/register').send(newUser)
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('message', MESSAGES.USER_REGISTERED)
  })

  it('should return an error if email is missing', async () => {
    const incompleteUser = {
      firstName: 'Test',
      lastName: 'User',
      email: '',
      username: 'testuser',
      password: 'password123',
      role: ROLES.ADMIN,
    }
    const response = await request(app).post('/users/register').send(incompleteUser)
    expect(response.status).toBe(400)
    expect(response.body).toStrictEqual({ message: MESSAGES.BAD_REQUEST })
  })

  it('should return an error if email isnt an email', async () => {
    const incompleteUser = {
      firstName: 'Invalid',
      lastName: 'Email',
      email: 'nope',
      username: 'InvalidEmail',
      password: 'STRONGP4$$w0rd_',
      role: ROLES.ADMIN,
    }
    const response = await request(app).post('/users/register').send(incompleteUser)
    expect(response.status).toBe(400)
    expect(response.body).toStrictEqual({ message: MESSAGES.BAD_REQUEST })
  })

  it('should return an error if password is weak', async () => {
    const weakPasswordUser = {
      firstName: 'Weak',
      lastName: 'Password',
      email: 'weakpassword@weak.com',
      username: 'weakpassword',
      password: 'weak',
      role: ROLES.ADMIN,
    }
    const response = await request(app).post('/users/register').send(weakPasswordUser)
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message', MESSAGES.WEAK_PASSWORD)
  })
})
