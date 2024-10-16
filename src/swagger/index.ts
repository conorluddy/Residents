import { Express } from 'express' // Import the 'Express' type from the 'express' module
import swaggerJsDoc, { Options } from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import dotenv from 'dotenv'
import MESSAGES from '../constants/messages'
import { version } from '../../package.json'
dotenv.config()

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Residents API',
      version,
      description: MESSAGES.API_DOCUMENTATION,
      externalDocs: [
        // Add link to website when up
      ],
    },
    servers: [
      {
        url: `http://localhost:${process.env.LOCAL_API_PORT}`,
      },
      // Add URL for served demo when up
    ],
  },
  apis: ['./src/routes/**/*.ts', './src/swagger/schemas/**.ts'],
}

const specs = swaggerJsDoc(options)

export default function swaggerSetup(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
  app.get('/api-json', (_req, res) => res.json(specs))
}
