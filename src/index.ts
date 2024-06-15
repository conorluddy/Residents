import express from "express"
import usersRouter from "./routes/users"
import { attachDb } from "./middleware/db"

const app = express()
const port = 3000

// Pin the Drizzle instance to the request object
app.use(attachDb)
app.use(express.json())

// Routers
app.use("/users", usersRouter)

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`)
})
