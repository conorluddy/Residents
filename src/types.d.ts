import "express"

// Customise the Express Request type to allow us attach a Drizzle instance
declare module "express-serve-static-core" {
  interface Request {
    db: NodePgDatabase
  }
}
