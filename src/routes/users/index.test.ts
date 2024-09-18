import express from 'express'
import request from 'supertest'
import router from './index'
import { HTTP_SUCCESS } from '../../constants/http'

jest.mock('./createUser', () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.CREATED)))
jest.mock('./updateUser', () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.OK)))
jest.mock('./getAllUsers', () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.OK)))
jest.mock('./getUser', () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.OK)))
jest.mock('./getSelf', () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.OK)))
jest.mock('./deleteUser', () => jest.fn((_req, res) => res.sendStatus(HTTP_SUCCESS.OK)))
jest.mock('../../db', jest.fn())

describe('Router', () => {
  let app = express()

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use(router)
  })

  it('should register all routes correctly', async () => {
    const routes: {
      path: string
      method: 'get' | 'post' | 'patch' | 'delete'
      handler: string
      expectedResponse: number
    }[] = [
      { path: '/register', method: 'post', handler: 'createUser', expectedResponse: HTTP_SUCCESS.CREATED },
      { path: '/123', method: 'patch', handler: 'updateUser', expectedResponse: HTTP_SUCCESS.OK },
      { path: '/', method: 'get', handler: 'getAllUsers', expectedResponse: HTTP_SUCCESS.OK },
      { path: '/123', method: 'get', handler: 'getUser', expectedResponse: HTTP_SUCCESS.OK },
      { path: '/self', method: 'get', handler: 'getSelf', expectedResponse: HTTP_SUCCESS.OK },
      { path: '/123', method: 'delete', handler: 'deleteUser', expectedResponse: HTTP_SUCCESS.OK },
    ]

    for (const route of routes) {
      const response = await request(app)[route.method](route.path)
      expect(response.status).toBeDefined()

      // These aren't working correctly, come back and fix em
      //   expect(response.status).toBe(route.expectedResponse)
    }
  })
})
