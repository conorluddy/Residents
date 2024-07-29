import express from "express"
import usersRouter from "./routes/users/index"
import authRouter from "./routes/auth"
import { attachDb } from "./middleware/util/database"
import { logger } from "./utils/logger"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import swaggerSetup from "./swagger"
import rateLimiter from "./middleware/util/rateLimiter"
import { HTTP_SUCCESS } from "./constants/http"
dotenv.config()

const port = process.env.LOCAL_API_PORT
const app = express()

// Middleware
app.disable("x-powered-by")
app.use(helmet())
app.use(rateLimiter)
app.use(express.json())
app.use(cookieParser())

// Routers
app.use("/users", usersRouter)
app.use("/auth", authRouter)

// Health check
app.get("/health", (req, res) => res.status(HTTP_SUCCESS.OK).json({ status: "👌" }))

//Not using this consistently at the moment - revisit
app.use(attachDb)

swaggerSetup(app)

// Run
const server = app.listen(port, () => {
  logger.info(`Running: http://localhost:${port}`)
  logger.info(`Swagger API docs are available at http://localhost:${port}/api-docs`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server")
  server.close(() => logger.info("HTTP server closed"))
})

export { app, server }
