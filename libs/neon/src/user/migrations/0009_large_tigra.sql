CREATE TABLE IF NOT EXISTS "stubbed_data" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"type" varchar NOT NULL,
	"data" json NOT NULL
);
