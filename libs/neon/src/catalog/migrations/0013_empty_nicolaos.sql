ALTER TABLE "live_artists" ALTER COLUMN "ext_followers" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "live_artists" ALTER COLUMN "ext_streams" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "live_songs" ALTER COLUMN "ext_streams" SET DATA TYPE bigint;