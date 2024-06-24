import express from "express"
import usersRouter from "./routes/users/index"
import authRouter from "./routes/auth"
import { attachDb } from "./middleware/db"
import { logger } from "./utils/logger"
import helmet from "helmet"

import swaggerSetup from "../swagger"

import dotenv from "dotenv"
dotenv.config()

const port = process.env.LOCAL_API_PORT
const app = express()

// Middleware
app.disable("x-powered-by")
app.use(helmet())
app.use(express.json())
app.use(attachDb)

// Routers
app.use("/users", usersRouter)
app.use("/auth", authRouter)

// Run
app.listen(port, () => {
  logger.info(`Running: http://localhost:${port}`)
  logger.info(
    `Swagger API docs are available at http://localhost:${port}/api-docs`
  )
})

swaggerSetup(app)
