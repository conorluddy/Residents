DO $$ BEGIN
 CREATE TYPE "public"."tokenType" AS ENUM('admin', 'owner', 'moderator', 'default', 'locked');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"type" "tokenType",
	"used" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "tokens_token_unique" UNIQUE("token")
);
