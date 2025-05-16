CREATE TABLE IF NOT EXISTS "ghost_network_configs" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"daily_budget" integer NOT NULL,
	"actual_daily_spend" integer NOT NULL,
	"number_of_ghost_users" integer NOT NULL,
	"min_plays_per_song" integer NOT NULL,
	"max_plays_per_song" integer NOT NULL,
	"songs" jsonb DEFAULT '[]'::jsonb
);
