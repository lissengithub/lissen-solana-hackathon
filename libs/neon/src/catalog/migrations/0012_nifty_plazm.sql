ALTER TABLE "live_artists" ADD COLUMN "ext_followers" integer;--> statement-breakpoint
ALTER TABLE "live_artists" ADD COLUMN "ext_streams" integer;--> statement-breakpoint
ALTER TABLE "live_songs" ADD COLUMN "ext_streams" integer;