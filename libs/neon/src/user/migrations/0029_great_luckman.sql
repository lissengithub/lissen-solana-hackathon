ALTER TABLE "claimed_gems" RENAME TO "gems_log";--> statement-breakpoint
DROP INDEX IF EXISTS "claimed_gems_unique_idx";--> statement-breakpoint
ALTER TABLE "gems_log" ADD COLUMN "amount" integer NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gems_log_idx" ON "gems_log" USING btree ("user_id","resource_type","resource_id","action");