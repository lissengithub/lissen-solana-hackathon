CREATE TABLE IF NOT EXISTS "artists_preferences" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"artist_id" varchar(36) PRIMARY KEY NOT NULL,
	"ext_link" text,
	"next_talk_date" timestamp (6) with time zone
);
