CREATE TABLE IF NOT EXISTS "fml_contests_winners" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"contest_id" varchar(36) PRIMARY KEY NOT NULL,
	"winners" jsonb NOT NULL
);
