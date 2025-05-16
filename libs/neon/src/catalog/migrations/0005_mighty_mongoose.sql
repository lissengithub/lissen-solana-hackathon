CREATE INDEX IF NOT EXISTS "live_albums_genres_idx" ON "live_albums" USING gin ("genre_ids");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "live_albums_artists_idx" ON "live_albums" USING gin ("artist_ids");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "live_songs_albums_idx" ON "live_songs" USING btree ("album_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "live_songs_artists_idx" ON "live_songs" USING gin ("artist_ids");