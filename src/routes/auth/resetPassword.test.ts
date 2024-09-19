import express from 'express'
import request from 'supertest'
import { ROLES } from '../../constants/database'
import { HTTP_SUCCESS } from '../../constants/http'
import { makeAFakeUser } from '../../test-utils/mockUsers'
import resetPasswordRoute from './resetPassword'

jest.mock('../../db', () => ({
  query: {
    tableUsers: {
      findFirst: jest.fn().mockImplementation(() => makeAFakeUser({ role: ROLES.DEFAULT })),
    },
  },
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      returning: jest.fn().mockImplementationOnce(async () => {
        return [{ id: 'tok1' }]
      }),
    }),
  }),
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockImplementationOnce(async () => {
        return [makeAFakeUser({ role: ROLES.DEFAULT })]
      }),
    }),
  }),
}))

jest.mock('../../mail/sendgrid', () => ({
  sendMail: jest.fn(),
}))

const app = express()
app.use(express.json())
app.use(resetPasswordRoute)

describe('POST /resetPassword', () => {
  it('should call the resetPassword controller and respond with a 400 BAD_REQUEST status if no resetPassword data is sent', async () => {
    const response = await request(app).post('/reset-password').send({ email: 'emile_metz@hotmail.com' })
    expect(response.body).toStrictEqual({ message: CHECK_EMAIL_RESET_LINK })
    expect(response.status).toBe(HTTP_SUCCESS.OK)
  })
})
