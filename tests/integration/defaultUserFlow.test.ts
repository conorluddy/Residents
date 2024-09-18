import request from 'supertest'
import { app } from '../../src'
import { dbClient } from '../../src/db'
import { HTTP_SUCCESS } from '../../src/constants/http'
import { ROLES } from '../../src/constants/database'

/**
 * - Create/Register a new user
 * - Attempt to get data while not authorised
 * - Log in with the new user
 * - Reattempt to get data while authorised
 */
describe('Integration: Default User flow', () => {
  let jwt: string

  beforeAll(async () => {
    await dbClient.connect()
    await dbClient.query('BEGIN') // Transaction
    await dbClient.query('DELETE FROM users')
  })

  afterAll(async () => {
    await dbClient.query('DELETE FROM users')
    await dbClient.query('ROLLBACK') // Rollback the transaction
    await dbClient.end()
  })

  it('Creates a new user', async () => {
    const newUser = {
      firstName: 'mrhappy',
      lastName: 'mrhappy',
      email: 'mrhappy@resi.dents',
      username: 'mrhappy',
      password: 'STRONGP4$$w0rd_',
      role: ROLES.ADMIN,
    }
    const response = await request(app).post('/users/register').send(newUser)
    // expect(logger.info).toHaveBeenCalledWith("Creating new user.")
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('message', 'User registered.')
  })

  it('Tries to hit a private endpoint without a token and gets bounced', async () => {
    const response = await request(app).get('/users/self')
    expect(response.status).toBe(401)
    expect(response.body).toMatchObject({
      message: 'Unauthorized access.',
    })
  })

  it('Logs in with the new user', async () => {
    const login = {
      username: 'mrhappy',
      password: 'STRONGP4$$w0rd_',
    }
    const response = await request(app).post('/auth').send(login)
    expect(response.status).toBe(HTTP_SUCCESS.OK)
    expect(response.body).toHaveProperty('token')
    jwt = response.body.token
  })

  it('Logs in and gets own user object', async () => {
    const login = {
      username: 'mrhappy',
      password: 'STRONGP4$$w0rd_',
    }

    // Log in

    const {
      body: { token: jwt },
    } = await request(app).post('/auth').send(login)

    expect(jwt).toBeDefined()

    // Get Self

    const {
      status,
      body: { user },
    } = await request(app).get('/users/self').set('Authorization', `Bearer ${jwt}`)

    expect(user).toMatchObject({
      username: 'mrhappy',
      email: 'mrhappy@resi.dents',
      firstName: 'mrhappy',
      lastName: 'mrhappy',
    })
    expect(status).toBe(HTTP_SUCCESS.OK)
  })
})
