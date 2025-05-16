-- Custom SQL migration file, put you code below! --
ALTER TABLE "artists_preferences" ADD COLUMN IF NOT EXISTS "is_processed" boolean DEFAULT false NOT NULL;