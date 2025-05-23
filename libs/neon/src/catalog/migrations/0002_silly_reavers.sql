CREATE TABLE IF NOT EXISTS "live_albums" (
	"id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"advisory" varchar,
	"image" varchar NOT NULL,
	"blurhash" varchar,
	"c_line" varchar,
	"total_duration" numeric NOT NULL,
	"track_count" integer NOT NULL,
	"artist_text" varchar NOT NULL,
	"genre_names" varchar[],
	"genre_ids" varchar[],
	"territories" varchar[] NOT NULL,
	"artist_names" varchar[] NOT NULL,
	"artist_images" varchar[] NOT NULL,
	"artist_ids" varchar[] NOT NULL,
	"artist_blurhashes" varchar[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "live_artists" (
	"id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"blurhash" varchar,
	"image" varchar NOT NULL,
	"is_featured_only" boolean NOT NULL,
	"genre_ids" varchar[] NOT NULL,
	"genre_names" varchar[] NOT NULL,
	"territories" varchar[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "live_songs" (
	"id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"active" boolean NOT NULL,
	"visible" boolean NOT NULL,
	"territories" varchar[] NOT NULL,
	"spotify_popularity" integer,
	"url_online" varchar NOT NULL,
	"url_offline" varchar NOT NULL,
	"duration" numeric NOT NULL,
	"track_number" integer NOT NULL,
	"genre_id" varchar,
	"genre_name" varchar,
	"album_blurhash" varchar,
	"album_title" varchar NOT NULL,
	"album_id" varchar NOT NULL,
	"album_image" varchar NOT NULL,
	"artist_ids" varchar[] NOT NULL,
	"featured_artist_ids" varchar[],
	"artist_text" varchar NOT NULL,
	"artist_blurhashes" varchar[],
	"artist_images" varchar[] NOT NULL,
	"artist_names" varchar[] NOT NULL,
	"audio_mode" numeric,
	"audio_timesignature" numeric,
	"audio_acousticness" numeric,
	"audio_liveness" numeric,
	"audio_danceability" numeric,
	"audio_instrumentalness" numeric,
	"audio_tempo" numeric,
	"audio_energy" numeric,
	"audio_speechiness" numeric,
	"audio_key" numeric,
	"audio_loudness" numeric,
	"audio_valence" numeric
);
