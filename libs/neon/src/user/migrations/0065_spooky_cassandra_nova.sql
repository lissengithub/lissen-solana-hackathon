ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "points_history"; 
ALTER TABLE "fml_artist_metrics" ADD COLUMN "points_history" jsonb; 