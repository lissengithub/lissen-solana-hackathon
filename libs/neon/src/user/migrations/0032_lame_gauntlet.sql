ALTER TABLE "gems_log" RENAME TO "gem_transaction_history";--> statement-breakpoint
DROP INDEX IF EXISTS "gems_log_idx";--> statement-breakpoint
ALTER TABLE "gem_transaction_history" ADD COLUMN "id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "gem_transaction_history" ADD COLUMN "artist_id" varchar(36);--> statement-breakpoint
ALTER TABLE "gem_transaction_history" ADD COLUMN "experience_id" varchar(36);--> statement-breakpoint
ALTER TABLE "gem_transaction_history" ADD COLUMN "user_voucher_id" varchar(36);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gem_transaction_history_idx" ON "gem_transaction_history" USING btree ("action","artist_id","experience_id","user_id","user_voucher_id");--> statement-breakpoint
ALTER TABLE "gem_transaction_history" DROP COLUMN IF EXISTS "resource_type";--> statement-breakpoint
ALTER TABLE "gem_transaction_history" DROP COLUMN IF EXISTS "resource_id";