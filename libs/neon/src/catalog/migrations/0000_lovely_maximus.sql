CREATE TABLE IF NOT EXISTS "albums_genres" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"album_id" varchar(36) NOT NULL,
	"genre_id" varchar(36) NOT NULL,
	CONSTRAINT "albums_genres_id" PRIMARY KEY("album_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "albums_subgenres" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"album_id" varchar(36) NOT NULL,
	"subgenre_id" varchar(36) NOT NULL,
	CONSTRAINT "albums_subgenres_id" PRIMARY KEY("album_id","subgenre_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "albums" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" jsonb NOT NULL,
	"image" text,
	"blurhash" varchar(200),
	"artist_text" jsonb NOT NULL,
	"type" varchar(20) NOT NULL,
	"c_line" varchar,
	"advisory" jsonb,
	"ext_id" varchar(36)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artists_albums" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"artist_id" varchar(36) NOT NULL,
	"album_id" varchar(36),
	"role" varchar NOT NULL,
	CONSTRAINT "artists_albums_constraint" UNIQUE("artist_id","album_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artists_songs" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"artist_id" varchar(36) NOT NULL,
	"song_id" varchar(36),
	"role" varchar(20) NOT NULL,
	CONSTRAINT "artists_songs_constraint" UNIQUE("artist_id","song_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artists" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" jsonb NOT NULL,
	"image" text,
	"blurhash" varchar(200),
	"artwork_y_offset" smallint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cdn_keys" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expiry" timestamp (6) with time zone NOT NULL,
	"bunny_cdn_path" varchar(200)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "creators_songs" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"role" varchar(20) NOT NULL,
	"song_id" varchar(36) NOT NULL,
	"creator_id" varchar(36) NOT NULL,
	CONSTRAINT "creators_songs_id" PRIMARY KEY("song_id","creator_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "creators" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" jsonb NOT NULL,
	"image" text,
	"blurhash" varchar(200)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genres" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" jsonb NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"primary_colour" varchar(7) DEFAULT '#ffffff' NOT NULL,
	"secondary_colour" varchar(7) DEFAULT '#000000' NOT NULL,
	"blurhash" varchar(200)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rights_controllers" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(30) NOT NULL,
	"dpid" varchar(36),
	CONSTRAINT "rights_controllers_id" PRIMARY KEY("name","type")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rights_holders" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar(30) NOT NULL,
	CONSTRAINT "rights_holders_id" PRIMARY KEY("name","type")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "song_rights" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"territoryCode" varchar(20) DEFAULT 'Worldwide' NOT NULL,
	"song_id" varchar(36) NOT NULL,
	"share" numeric NOT NULL,
	"rights_controller_id" varchar(36) NOT NULL,
	"right_type" varchar(20) NOT NULL,
	CONSTRAINT "song_rights_id" PRIMARY KEY("song_id","rights_controller_id","right_type")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "songs" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" jsonb NOT NULL,
	"duration" numeric,
	"url_online" text,
	"url_offline" text,
	"url_original" text,
	"isrc" varchar(255),
	"iswc" varchar(255),
	"pline" varchar,
	"track_number" smallint,
	"active" boolean,
	"visible" boolean,
	"album_id" varchar(36) DEFAULT '' NOT NULL,
	"artist_display_text" jsonb DEFAULT '{"Worldwide":""}'::jsonb,
	"advisory" jsonb,
	"is_instrumental" boolean DEFAULT false,
	"language" varchar(20) DEFAULT '',
	"deals" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "songs_genres" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"song_id" varchar(36) NOT NULL,
	"genre_id" varchar(36) NOT NULL,
	CONSTRAINT "songs_genres_id" PRIMARY KEY("song_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "songs_subgenres" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"song_id" varchar(36) NOT NULL,
	"subgenre_id" varchar(36) NOT NULL,
	CONSTRAINT "songs_subgenres_id" PRIMARY KEY("song_id","subgenre_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "songs_rights_holders" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"song_id" varchar(36) NOT NULL,
	"rights_holder_id" varchar(36) NOT NULL,
	"share" numeric NOT NULL,
	"territory_code" varchar(20) NOT NULL,
	"right_type" varchar,
	CONSTRAINT "song_rights_rights_holders_id" PRIMARY KEY("song_id","rights_holder_id","territory_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subgenres" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" jsonb NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"primary_colour" varchar(7) DEFAULT '#ffffff' NOT NULL,
	"secondary_colour" varchar(7) DEFAULT '#000000' NOT NULL,
	"blurhash" varchar(200)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "albums_title_search_index" ON "albums" USING gin (to_tsvector('english', "title"));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "albums_artists_idx" ON "artists_albums" USING btree ("album_id","artist_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "songs_artists_idx" ON "artists_songs" USING btree ("song_id","artist_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "artists_title_search_index" ON "artists" USING gin (to_tsvector('english', "name"));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "songs_albumid_idx" ON "songs" USING btree ("album_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "songs_title_search_index" ON "songs" USING gin (to_tsvector('english', "title"));