import dotenv from "dotenv"
import express from "express"
import usersRouter from "./routes/users"
import { attachDb } from "./middleware/db"
import { logger } from "./utils/logger"
import helmet from "helmet"
dotenv.config()

const app = express()
// Middleware
app.disable("x-powered-by")
app.use(helmet())
app.use(express.json())
app.use(attachDb) // Pin the Drizzle instance to the request object

// Routers
app.use("/users", usersRouter)

const port = process.env.API_PORT
app.listen(port, () => {
  logger.info(`App running on http://localhost:${port}`)
})
