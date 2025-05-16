CREATE TABLE IF NOT EXISTS "sol_unlocked_songs" (
	"user_id" varchar NOT NULL,
	"song_id" varchar NOT NULL
);
--> statement-breakpoint
DROP INDEX IF EXISTS "gem_transaction_history_artist_points_log_idx";--> statement-breakpoint
ALTER TABLE "gem_transaction_history" DROP COLUMN IF EXISTS "artist_points_log_id";