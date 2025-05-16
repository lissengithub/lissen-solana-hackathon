CREATE TABLE IF NOT EXISTS "discover_dailies" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"date" timestamp (6) with time zone NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"song_ids" jsonb NOT NULL,
	CONSTRAINT "discover_dailies_id" PRIMARY KEY("user_id","date")
);
