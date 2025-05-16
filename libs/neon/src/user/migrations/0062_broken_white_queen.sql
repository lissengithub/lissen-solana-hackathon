CREATE TABLE IF NOT EXISTS "fml_artist_metrics" (
	"artist_id" varchar(36) PRIMARY KEY NOT NULL,
	"spotify_follower_count" integer,
	"youtube_follower_count" integer,
	"soundcloud_follower_count" integer,
	"tiktok_follower_count" integer,
	"instagram_follower_count" integer,
	"soundcloud_plays" integer,
	"spotify_streams" integer,
	"tiktok_streams" integer,
	"youtube_views" integer,
	"lissen_streams" integer,
	"social_follower_points" integer DEFAULT 0 NOT NULL,
	"music_follower_points" integer DEFAULT 0 NOT NULL,
	"music_stream_points" integer DEFAULT 0 NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"points_history" integer[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
DROP TABLE "fml_artist_points";--> statement-breakpoint
ALTER TABLE "fml_contest_leaderboards" ADD COLUMN "total_points" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_contest_leaderboards" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "fml_contest_leaderboards" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "fml_contest_leaderboards" DROP COLUMN IF EXISTS "total_score";