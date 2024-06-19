DO $$ BEGIN
 CREATE TYPE "public"."userRole" AS ENUM('owner', 'admin', 'moderator', 'default');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."userVerification" AS ENUM('unverified', 'pending', 'verified', 'rejected', 'banned');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
	"first_name" text,
	"last_name" text,
	"email" text NOT NULL,
	"userVerification" "userVerification" DEFAULT 'unverified',
	"username" text NOT NULL,
	"password" text,
	"created_at" timestamp DEFAULT now(),
	"userRole" "userRole" DEFAULT 'default',
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
