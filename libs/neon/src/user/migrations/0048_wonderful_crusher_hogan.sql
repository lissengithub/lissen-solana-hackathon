CREATE TABLE IF NOT EXISTS "onboarding_playlists" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"playlist_id" varchar(36) PRIMARY KEY NOT NULL
);
