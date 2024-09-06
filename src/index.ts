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
import xsrfTokens from "./middleware/auth/xsrfTokens"
import errorHandler from "./middleware/util/errorHandler"
import path from "path"

dotenv.config()

const isTestEnv = process.env.NODE_ENV === "test"
const port = process.env.LOCAL_API_PORT
const app = express()

////////////////////////////////////////////////
// Middlewares
////////////////////////////////////////////////

app.disable("x-powered-by")
app.use(helmet())
app.use(rateLimiter)
app.use(express.json())

// Health check
app.get("/health", (_req, res) => res.status(HTTP_SUCCESS.OK).json({ status: "👌" }))

//
app.use(cookieParser())
app.use(xsrfTokens) // Maybe move this to specific endpoints
// Routers
app.use("/users", usersRouter)
app.use("/auth", authRouter)

//Not using this consistently at the moment - revisit
app.use(attachDb)

// Swagger
swaggerSetup(app)

// Error handling <always last>
app.use(errorHandler)

// Add CSP middleware
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'")
  next()
})

// Serve static files from the 'examples' directory
app.use(express.static(path.join(__dirname, "../examples")))

// Add this route to serve the index.html file
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../examples/index.html"))
})

////////////////////////////////////////////////
// /Middleware
////////////////////////////////////////////////

// Randomise ports in test environment
const serverPort = isTestEnv ? 0 : port
// Run
const server = app.listen(serverPort, () => {
  logger.info(`Running: http://localhost:${serverPort}`)
  logger.info(`Swagger API docs are available at http://localhost:${serverPort}/api-docs`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server")
  server.close(() => logger.info("HTTP server closed"))
})

export { app, server }
