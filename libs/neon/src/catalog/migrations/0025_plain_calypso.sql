ALTER TABLE "fml_artist_metrics" ADD COLUMN "instagram_follower_count" integer;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "tiktok_follower_count" integer;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "instagram_follower_weight";--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "tiktok_follower_weight";