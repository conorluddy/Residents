import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import MESSAGES from './constants/messages'
import { logger } from './utils/logger'
import app from './index'

dotenv.config()
const isTestEnv = process.env.NODE_ENV === 'test'
const isDevEnv = process.env.NODE_ENV === 'development'
const port = process.env.LOCAL_API_PORT

/**
 * Only serving static files devel environment
 */
if (isDevEnv) {
  // Serve static files from the 'examples' directory
  app.use(express.static(path.join(__dirname, '../examples')))

  // Serve the vanilla example on the same server as the API.
  // Other examples should be run independently from their directories.
  app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '../examples/vanilla/index.html'))
  })
}

// Add Content Security Policy (CSP) middleware
app.use((req, res, next) => {
  // This middleware sets a Content-Security-Policy header to enhance security
  // It restricts the sources from which content can be loaded:
  // - default-src 'self': Only allow resources from the same origin
  // - script-src 'self': Only allow scripts from the same origin
  // - style-src 'self' 'unsafe-inline': Allow styles from the same origin and inline styles
  // This helps prevent various types of attacks, such as XSS (Cross-Site Scripting)
  // eslint-disable-next-line quotes
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'")
  next()
})

// Randomise ports in test environment
const serverPort = isTestEnv ? 0 : port

// Run
const server = app.listen(serverPort, () => {
  if (isDevEnv) {
    logger.info('Server is running in DEVELOPMENT mode. Swagger Docs @ /api-docs.')
  } else {
    logger.info('Server is Running.')
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info(MESSAGES.SIGTERM_RECEIVED_CLOSING_SERVER)
  server.close(() => logger.info(MESSAGES.SERVER_SHUTDOWN))
})
