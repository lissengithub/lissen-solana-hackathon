ALTER TABLE "live_albums" ADD COLUMN "has_private_song" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "live_songs" ADD COLUMN "private" boolean DEFAULT false NOT NULL;