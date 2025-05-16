CREATE TABLE IF NOT EXISTS "app_versions" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"version" text PRIMARY KEY NOT NULL,
	"update_messages" varchar(500) NOT NULL,
	"force_update" boolean DEFAULT false NOT NULL
);
