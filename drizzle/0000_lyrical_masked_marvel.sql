
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "federatedCredentials" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"provider" text NOT NULL,
	"subject" text NOT NULL,
	CONSTRAINT "federatedCredentials_subject_unique" UNIQUE("subject")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text NOT NULL,
	"role" "userRole" DEFAULT 'default',
	"rank" real DEFAULT 1,
	"password" text,
	"status" "userStatus" DEFAULT 'unverified',
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
