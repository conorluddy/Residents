import { Express } from "express" // Import the 'Express' type from the 'express' module
import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import dotenv from "dotenv"
dotenv.config()

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Residents API",
      version: "0.0.1",
      description: "API documentation",
    },
    servers: [
      {
        url: `http://localhost:${process.env.LOCAL_API_PORT}`,
      },
    ],
  },
  apis: ["./src/routes/**/*.ts"],
}

const specs = swaggerJsDoc(options)

export default function swaggerSetup(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))
}
