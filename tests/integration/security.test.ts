import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app } from '../../src'
import { postgresDatabaseClient } from '../../src/db'
import MESSAGES from '../../src/constants/messages'

describe('Integration: Security hardening', () => {
  beforeAll(async () => {
    await postgresDatabaseClient.connect()
    await postgresDatabaseClient.query('BEGIN')
  })

  afterAll(async () => {
    await postgresDatabaseClient.query('ROLLBACK')
    await postgresDatabaseClient.end()
  })

  it('rejects a JWT signed with alg: none', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unsignedToken = jwt.sign({ id: 'fake', username: 'fake' }, '', { algorithm: 'none' as any })
    const response = await request(app)
      .get('/users/self')
      .set('Authorization', `Bearer ${unsignedToken}`)
    expect(response.status).toBe(401)
    expect(response.body).toMatchObject({ message: MESSAGES.UNAUTHORIZED })
  })

  it('rejects a JSON body larger than 10kb with 413', async () => {
    const oversizedBody = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      username: 'testuser',
      password: 'STRONGP4$$w0rd_',
      padding: 'x'.repeat(11_000),
    }
    const response = await request(app).post('/users/register').send(oversizedBody)
    expect(response.status).toBe(413)
  })
})
