DROP INDEX IF EXISTS "gem_transaction_history_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gem_transaction_history_artist_idx" ON "gem_transaction_history" USING btree ("action","artist_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gem_transaction_history_experience_idx" ON "gem_transaction_history" USING btree ("action","experience_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gem_transaction_history_user_voucher_idx" ON "gem_transaction_history" USING btree ("action","user_id","user_voucher_id");