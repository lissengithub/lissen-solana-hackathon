CREATE TABLE IF NOT EXISTS "fml_contest_traits" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contest_id" text NOT NULL,
	"trait_id" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fml_league_traits" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" varchar(36) NOT NULL,
	"trait_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fml_leagues" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"image" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "fml_contests" ADD COLUMN "league_id" varchar(36);