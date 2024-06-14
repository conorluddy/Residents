import { Request, Response, NextFunction, RequestHandler } from "express"
import db from "../db/connection"

// Attach the Drizzle instance to the request object so we can access
// it in our routes without importing it everywhere
export const attachDb: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  req.db = db
  next()
}
