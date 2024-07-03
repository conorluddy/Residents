import dotenv from "dotenv"
import { NextFunction, Request, Response } from "express"

dotenv.config()

export const finalMw = (req: Request, res: Response, next: NextFunction) => {
  console.log("finally middleware")

  res.on("finish", () => {
    // This code will run after the response is sent to the client
    // We could use it to clean up tokens, etc.
    console.log("\n\ngetSelf response sent")
  })

  next()
}
export default finalMw
