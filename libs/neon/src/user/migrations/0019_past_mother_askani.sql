CREATE TABLE IF NOT EXISTS "artist_top_songs_cache" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"resources" jsonb NOT NULL,
	"artist_id" varchar(36) NOT NULL,
	CONSTRAINT "artist_top_songs_cache_id" PRIMARY KEY("artist_id")
);
