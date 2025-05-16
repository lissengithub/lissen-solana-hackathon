CREATE INDEX IF NOT EXISTS "fml_artists_name_gin_idx" ON "fml_artists" USING GIN ("name" gin_trgm_ops);
