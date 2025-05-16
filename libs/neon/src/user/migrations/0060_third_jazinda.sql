ALTER TABLE "fml_artist_stats" ALTER COLUMN "percent_change" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "fml_artist_stats" ALTER COLUMN "percent_change" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "fml_artist_stats" ADD COLUMN "score_history" integer[] NOT NULL DEFAULT '{}';