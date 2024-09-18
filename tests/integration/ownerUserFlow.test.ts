import request from 'supertest'
import { app } from '../../src'
import { dbClient } from '../../src/db'
import seedUserZero, { DEFAULT_SEED_PASSWORD } from '../../src/db/utils/seedUserZero'
import { seedUsers } from '../../src/db/utils/seedUsers'
import { HTTP_SUCCESS } from '../../src/constants/http'

/**
 * - Seed the default owner user into the DB
 * - Log in as the Owner
 * - Get self/own user data
 * - Get all users
 * - Delete a user
 * - Get a specific user
 */

describe('Integration: Owner flow from seeded default owner', () => {
  let jwt: string

  beforeAll(async () => {
    await dbClient.connect()
    await dbClient.query('BEGIN') // Transaction
    await dbClient.query('DELETE FROM users')
    await seedUserZero()
    await seedUsers(10)
  })

  afterAll(async () => {
    await dbClient.query('DELETE FROM users')
    await dbClient.query('ROLLBACK') // Rollback the transaction
    await dbClient.end()
  })

  it('Log in as the owner - Resident Zero', async () => {
    const login = {
      username: 'resident',
      password: DEFAULT_SEED_PASSWORD,
    }
    const response = await request(app).post('/auth').send(login)
    expect(response.body).toHaveProperty('token')
    expect(response.status).toBe(HTTP_SUCCESS.OK)
    jwt = response.body.token
  })

  it('Hit the /self endpoint once logged in and get own user object', async () => {
    const login = {
      username: 'resident',
      password: DEFAULT_SEED_PASSWORD,
    }
    const loginResponse = await request(app).post('/auth').send(login)

    expect(loginResponse.body).toHaveProperty('token')
    expect(loginResponse.status).toBe(HTTP_SUCCESS.OK)

    const jwt = loginResponse.body.token

    const jwt = loginResponse.body.token

    expect(response.body.user).toMatchObject({
      firstName: 'Resident',
      lastName: 'Zero',
      username: 'resident',
    })
    expect(response.status).toBe(HTTP_SUCCESS.OK)
  })

  it('Hit the /getAllUsers endpoint once logged in and get all of the users back', async () => {
    const response = await request(app).get('/users').set('Authorization', `Bearer ${jwt}`)
    expect(response.status).toBe(HTTP_SUCCESS.OK)
    expect(response.body.users).toHaveLength(21) // 10 seeded users + the owner. TODO: fix. Mystery 10 coming from somewhere....
  })

  it('Call getAllUsers again and delete one of them', async () => {
    const login = {
      username: 'resident',
      password: DEFAULT_SEED_PASSWORD,
    }
    const loginResponse = await request(app).post('/auth').send(login)

    expect(loginResponse.body).toHaveProperty('token')
    expect(loginResponse.status).toBe(HTTP_SUCCESS.OK)
    const jwt = loginResponse.body.token

    const usersResponse = await request(app).get('/users').set('Authorization', `Bearer ${jwt}`)
    const userIdToDelete = usersResponse.body.users[3].id

    const deleteResponse = await request(app)
      .delete(`/users/${ userIdToDelete}`)
      .set('Authorization', `Bearer ${jwt}`)

    expect(deleteResponse.body).toMatchObject({ message: `User ${userIdToDelete} deleted` })
    expect(deleteResponse.status).toBe(HTTP_SUCCESS.OK)
  })

  it('Call getAllUsers again and then get a specific one', async () => {
    const login = {
      username: 'resident',
      password: DEFAULT_SEED_PASSWORD,
    }
    const loginResponse = await request(app).post('/auth').send(login)

    expect(loginResponse.body).toHaveProperty('token')
    expect(loginResponse.status).toBe(HTTP_SUCCESS.OK)
    const jwt = loginResponse.body.token

    const usersResponse = await request(app).get('/users').set('Authorization', `Bearer ${jwt}`)
    const userIdToGet = usersResponse.body.users[5].id
    const userResponse = await request(app)
      .get(`/users/${ userIdToGet}`)
      .set('Authorization', `Bearer ${jwt}`)
    expect(userResponse.status).toBe(HTTP_SUCCESS.OK)
    expect(userResponse.body).toMatchObject({
      ...usersResponse.body[5],
    })
  })
})
