import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app } from '../../src'
import { postgresDatabaseClient } from '../../src/db'
import SERVICES from '../../src/services'
import { ROLES, TOKEN_TYPE } from '../../src/constants/database'
import { TIMESPAN } from '../../src/constants/time'
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

  describe('token type confusion', () => {
    // A magic-login/reset-password/validate token id is emailed to the user and logged
    // in plaintext server-side — it must never double as a refresh token. Otherwise
    // anyone who intercepts one of those (email forwarding/preview bots, log access)
    // could mint a live session or force-wipe the victim's real sessions.
    let userId: string

    beforeAll(async () => {
      const email = 'token-confusion@resi.dents'
      await request(app).post('/users/register').send({
        firstName: 'Token',
        lastName: 'Confusion',
        email,
        username: 'tokenconfusion',
        password: 'STRONGP4$$w0rd_',
        role: ROLES.DEFAULT,
      })
      const user = await SERVICES.getUserByEmail(email)
      userId = user!.id
    })

    it('rejects a magic-login token id presented as a refresh token', async () => {
      const magicTokenId = await SERVICES.createToken({
        userId,
        type: TOKEN_TYPE.MAGIC,
        expiry: TIMESPAN.MINUTE * 10,
      })
      const response = await request(app).post('/auth/refresh').set('Cookie', `refreshToken=${magicTokenId}`)
      // ForbiddenError renders as the generic ACCESS_DENIED message at the HTTP layer
      // (the specific TOKEN_NOT_FOUND reason isn't leaked to the client) — the real
      // assertion is the 403 plus no token/cookie being handed back.
      expect(response.status).toBe(403)
      expect(response.body).toMatchObject({ message: MESSAGES.ACCESS_DENIED })
      expect(response.body).not.toHaveProperty('token')
    })

    it('does not wipe sessions when a magic-login token id is presented to logout', async () => {
      const magicTokenId = await SERVICES.createToken({
        userId,
        type: TOKEN_TYPE.MAGIC,
        expiry: TIMESPAN.MINUTE * 10,
      })
      const response = await request(app).get('/auth/logout').set('Cookie', `refreshToken=${magicTokenId}`)
      // logout always degrades to 200 regardless — the assertion that matters is that
      // the magic token is still there afterwards, i.e. it wasn't treated as a refresh
      // token and swept up by deleteRefreshTokensByUserId.
      expect(response.status).toBe(200)
      const stillValid = await SERVICES.getToken({ tokenId: magicTokenId as string, type: TOKEN_TYPE.MAGIC })
      expect(stillValid).toBeTruthy()
    })

    it('rejects a reset-password token id presented to magic-login', async () => {
      // findValidTokenById (shared by magic-login/reset-password/validate) only checks
      // used/expired, not type — a longer-lived RESET token (1hr) must not authenticate
      // via the magic-login endpoint (10min-token, no password required).
      const resetTokenId = await SERVICES.createToken({
        userId,
        type: TOKEN_TYPE.RESET,
        expiry: TIMESPAN.HOUR,
      })
      const response = await request(app).get(`/auth/magic-login/${resetTokenId}`)
      expect(response.status).toBe(401)
      expect(response.body).toMatchObject({ message: MESSAGES.TOKEN_INVALID })
      expect(response.body).not.toHaveProperty('token')
    })
  })
})
