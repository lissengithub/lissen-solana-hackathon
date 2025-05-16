CREATE TABLE IF NOT EXISTS "live_genres" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"image" varchar,
	"blurhash" varchar,
	"primary_colour" varchar,
	"secondary_colour" varchar,
	"territories" varchar[] NOT NULL
);
