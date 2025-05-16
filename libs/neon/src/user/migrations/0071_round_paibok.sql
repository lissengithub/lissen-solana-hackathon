ALTER TABLE "fml_artist_mapping" DROP CONSTRAINT IF EXISTS "fml_artist_mapping_pkey";--> statement-breakpoint
ALTER TABLE "fml_artist_mapping" ALTER COLUMN "sc_artist_id" DROP NOT NULL;