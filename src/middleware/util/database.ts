import { Request, Response, NextFunction, RequestHandler } from 'express'
import db from '../../db'
import { REQUEST_DB } from '../../types/requestSymbols'

// Attach the Drizzle instance to the request object so we can access
// it in our routes without importing it everywhere
export const attachDb: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  req[REQUEST_DB] = db
  next()
}
