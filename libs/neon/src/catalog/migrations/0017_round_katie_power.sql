CREATE INDEX IF NOT EXISTS "live_albums_artists_idx" ON "live_albums" USING gin ("artist_ids");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "live_albums_genres_idx" ON "live_albums" USING gin ("genre_ids");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "live_albums_title_idx" ON "live_albums" USING btree (lower("title"));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "live_albums_title_gin_idx" ON "live_albums" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "live_artists_name_idx" ON "live_artists" USING btree (lower("name"));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "live_artists_name_gin_idx" ON "live_artists" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "live_songs_albums_idx" ON "live_songs" USING btree ("album_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "live_songs_artists_idx" ON "live_songs" USING gin ("artist_ids");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "live_songs_title_idx" ON "live_songs" USING btree (lower("title"));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "live_songs_title_artist_text_gin_idx" ON "live_songs" USING gin (("title" || ' ' || "artist_text") gin_trgm_ops);