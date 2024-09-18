import request from 'supertest'
import express from 'express'
import dotenv from 'dotenv'
import swaggerSetup from './index'
import { HTTP_SUCCESS } from '../constants/http'

dotenv.config()

const app = express()
swaggerSetup(app)

describe('Swagger Setup', () => {
  it('should serve the swagger docs', async () => {
    const response = await request(app).get('/api-docs')
    expect(response.status).toBe(301) // Redirect to /api-docs/
  })

  it('should display the swagger UI', async () => {
    const response = await request(app).get('/api-docs/')
    expect(response.status).toBe(HTTP_SUCCESS.OK)
    expect(response.text).toContain('Swagger UI')
  })
})
