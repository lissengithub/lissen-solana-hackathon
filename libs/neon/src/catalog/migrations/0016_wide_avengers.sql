-- Custom SQL migration file, put you code below! --
CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
CREATE INDEX trgm_idx_gin_live_artists_name ON live_artists USING GIN (lower(name) gin_trgm_ops);--> statement-breakpoint
