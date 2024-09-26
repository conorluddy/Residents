import { Response, NextFunction, RequestHandler } from 'express'
import db from '../../db'
import { REQUEST_DB } from '../../types/requestSymbols'
import { ResidentRequest, ResidentResponse } from '../../types'

// Attach the Drizzle instance to the request object so we can access
// it in our routes without importing it everywhere
export const attachDb: RequestHandler = (
  req: ResidentRequest,
  _res: Response<ResidentResponse>,
  next: NextFunction
) => {
  req[REQUEST_DB] = db
  next()
}
