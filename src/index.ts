import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
const db = drizzle(sql)

// const result = await db.select().from();
