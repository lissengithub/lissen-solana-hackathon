UPDATE "fml_contests" SET "league_id" = '' WHERE "league_id" IS NULL;--> statement-breakpoint
ALTER TABLE "fml_contests" ALTER COLUMN "league_id" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "fml_contests" ALTER COLUMN "league_id" SET NOT NULL;