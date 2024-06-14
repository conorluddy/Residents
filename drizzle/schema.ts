import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	first_name: text("first_name"),
	last_name: text("last_name"),
	email: text("email"),
	username: text("username"),
	password: text("password"),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
});