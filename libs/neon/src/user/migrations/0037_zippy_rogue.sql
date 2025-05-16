CREATE INDEX IF NOT EXISTS "artist_id_timestamp_artists_user_leaderboard_idx" ON "artists_user_leaderboard" USING btree ("artist_id","timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_timestamp_artists_user_leaderboard_idx" ON "artists_user_leaderboard" USING btree ("user_id","timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_rank_idx" ON "artists_user_leaderboard" USING btree ("user_rank");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "artist_id_timestamp_users_artist_leaderboard_idx" ON "users_artist_leaderboard" USING btree ("artist_id","timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "artist_rank_idx" ON "users_artist_leaderboard" USING btree ("artist_rank");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_timestamp_users_artist_leaderboard_idx" ON "users_artist_leaderboard" USING btree ("user_id","timestamp");--> statement-breakpoint
ALTER TABLE "artists_user_leaderboard" DROP CONSTRAINT artists_user_leaderboard_id;
--> statement-breakpoint
ALTER TABLE "artists_user_leaderboard" ADD CONSTRAINT artists_user_leaderboard_id PRIMARY KEY(artist_id,timestamp,user_id);--> statement-breakpoint
ALTER TABLE "users_artist_leaderboard" DROP CONSTRAINT users_artist_leaderboard_id;
--> statement-breakpoint
ALTER TABLE "users_artist_leaderboard" ADD CONSTRAINT users_artist_leaderboard_id PRIMARY KEY(user_id,timestamp,artist_id);