ALTER TABLE "tokens" DROP CONSTRAINT "tokens_token_unique";--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_id_unique" UNIQUE("id");