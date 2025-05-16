DROP TABLE "artists_user_leaderboard";--> statement-breakpoint
ALTER TABLE "users_artist_leaderboard" RENAME COLUMN "artist_rank" TO "artist_rank_for_user";--> statement-breakpoint
DROP INDEX IF EXISTS "artist_id_timestamp_users_artist_leaderboard_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "artist_rank_idx";--> statement-breakpoint
ALTER TABLE "users_artist_leaderboard" ADD COLUMN "user_rank_amongst_other_users" integer NOT NULL;