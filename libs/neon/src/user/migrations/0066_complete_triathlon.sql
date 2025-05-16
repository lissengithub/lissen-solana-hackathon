ALTER TABLE "fml_artist_metrics" ADD COLUMN "total_points_history" jsonb DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "points_history";