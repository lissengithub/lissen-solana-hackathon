CREATE TABLE IF NOT EXISTS "live_artist_catalog_coverage" (
	"id" varchar PRIMARY KEY NOT NULL,
	"lissen_songs" integer,
	"sc_songs" integer,
	"sc_catalog_coverage" numeric
);
