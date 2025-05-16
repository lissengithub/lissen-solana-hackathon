ALTER TABLE "fml_artist_metrics" ADD COLUMN "spotify_follower_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "youtube_follower_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "soundcloud_follower_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "tiktok_follower_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "instagram_follower_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "soundcloud_plays_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "spotify_streams_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "tiktok_streams_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "youtube_views_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "lissen_streams_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "total_points_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "total_base_points_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "total_engagement_points_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "base_music_points" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "base_music_points_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "base_social_points" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "base_social_points_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "engagement_music_points" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "engagement_music_points_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "engagement_social_points" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "engagement_social_points_pct" numeric DEFAULT '0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "social_follower_points";--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "music_follower_points";--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "music_stream_points";