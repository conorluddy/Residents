import express from "express"
import usersRouter from "./routes/users"
import { attachDb } from "./middleware/db"
import { logger } from "./utils/logger"

const app = express()
const port = 3000

// Pin the Drizzle instance to the request object
app.use(attachDb)

// Middleware
app.use(express.json())

// Routers
app.use("/users", usersRouter)

app.listen(port, () => {
  logger.info(`App running on http://localhost:${port}`)
})
