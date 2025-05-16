CREATE TABLE IF NOT EXISTS "app_events_processing" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"link" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp (6) with time zone NOT NULL,
	"start_date" timestamp (6) with time zone NOT NULL,
	"end_date" timestamp (6) with time zone NOT NULL,
	"status" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "archived_playlists" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "archived_users" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"data" jsonb NOT NULL
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
CREATE TABLE IF NOT EXISTS "challenges" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"start_time" timestamp (6) with time zone NOT NULL,
	"end_time" timestamp (6) with time zone NOT NULL,
	"status" varchar(20) NOT NULL,
	"experience_id" varchar(36) NOT NULL,
	"max_participants" smallint,
	"item_amount" smallint NOT NULL,
	"type" varchar(20) NOT NULL,
	"action_details" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "consumer_wallets" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"eoa" varchar(42) NOT NULL,
	"private_key" text NOT NULL,
	"seed_phrase" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "consumers" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription" varchar(20) NOT NULL,
	"wallet_id" varchar(36)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "experience_collaborators" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"experience_id" varchar(36) NOT NULL,
	"artist_id" varchar(36) NOT NULL,
	"accepted" boolean,
	CONSTRAINT "experience_collaborators_id" PRIMARY KEY("experience_id","artist_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "experiences" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(20) NOT NULL,
	"item_amount" smallint NOT NULL,
	"item_price" numeric NOT NULL,
	"item_info" jsonb NOT NULL,
	"artist_id" varchar(36) NOT NULL,
	"image" text,
	"blurhash" varchar(200)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "followers" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(28) NOT NULL,
	"artist_id" varchar(36) NOT NULL,
	"type" varchar(20) NOT NULL,
	CONSTRAINT "followers_id" PRIMARY KEY("user_id","artist_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gifts" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"start_time" timestamp (6) with time zone NOT NULL,
	"end_time" timestamp (6) with time zone NOT NULL,
	"experience_id" varchar(36) NOT NULL,
	"item_amount" smallint NOT NULL,
	"items_left" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inboxes" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(28) NOT NULL,
	"read" timestamp (6) with time zone,
	"title" text NOT NULL,
	"type" varchar(30) NOT NULL,
	"resource_type" varchar(30) NOT NULL,
	"resource_id" varchar(36) NOT NULL,
	CONSTRAINT "user_inboxes_id" PRIMARY KEY("user_id","resource_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"claimed" boolean DEFAULT false,
	"redeem_code" varchar(100) NOT NULL,
	"source_id" varchar(36) NOT NULL,
	"source_type" varchar(20) NOT NULL,
	"winner_id" varchar(28) NOT NULL,
	"date" timestamp (6) with time zone NOT NULL,
	"price_original" numeric NOT NULL,
	"price_actual" numeric NOT NULL,
	"experience_id" varchar(36) NOT NULL,
	"type" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "managers" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(28) NOT NULL,
	"entity_id" varchar(36) NOT NULL,
	"entity_type" varchar(20) NOT NULL,
	"access_level" smallint NOT NULL,
	CONSTRAINT "managers_user_entity_id" PRIMARY KEY("user_id","entity_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "participants_challenges" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(28) NOT NULL,
	"challenge_id" varchar(36) NOT NULL,
	"qualified" boolean,
	CONSTRAINT "participants_challenges_id" PRIMARY KEY("user_id","challenge_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "partner_tokens" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"rights_controller_name" varchar(36) NOT NULL,
	"rights_controller_id" varchar(36),
	"token" varchar(100) NOT NULL,
	CONSTRAINT "partner_tokens_id" PRIMARY KEY("token","rights_controller_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_profiles" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" varchar(20) NOT NULL,
	"amount_paid" numeric,
	"amount_received" numeric,
	"amount_net" numeric,
	"currency" varchar(3),
	"provider" varchar(20) NOT NULL,
	"start_date" timestamp (6) with time zone NOT NULL,
	"end_date" timestamp (6) with time zone,
	"tax_percentage" numeric,
	"consumer_id" varchar(36)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playlists_songs" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"song_id" varchar(36) NOT NULL,
	"playlist_id" varchar(36) NOT NULL,
	CONSTRAINT "playlists_songs_id" PRIMARY KEY("song_id","playlist_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playlists" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"image" text,
	"blurhash" varchar(200),
	"visibility" varchar(20) DEFAULT 'private' NOT NULL,
	"genre_id" varchar(36)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations_action_points" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"name" varchar(100) PRIMARY KEY NOT NULL,
	"album" jsonb,
	"song" jsonb,
	"playlist" jsonb,
	"artist" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations_platform" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"resource_id" varchar(36) NOT NULL,
	"type" varchar(20) NOT NULL,
	"territory_code" varchar(10) DEFAULT 'Worldwide' NOT NULL,
	CONSTRAINT "recommendations_platform_id" PRIMARY KEY("resource_id","type","territory_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations_thresholds" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"name" varchar(100) PRIMARY KEY NOT NULL,
	"value" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "song_stats" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"artist_id" varchar(36) NOT NULL,
	"song_id" varchar(36) PRIMARY KEY NOT NULL,
	"total_stream_time" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_favourites" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"collection_id" varchar(36) NOT NULL,
	"collection_type" varchar(20) NOT NULL,
	CONSTRAINT "user_favourites_id" PRIMARY KEY("user_id","collection_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_library_albums" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"album_id" varchar(36) NOT NULL,
	CONSTRAINT "user_library_albums_id" PRIMARY KEY("user_id","album_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_library_artists" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"artist_id" varchar(36) NOT NULL,
	CONSTRAINT "user_library_artists_id" PRIMARY KEY("user_id","artist_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_library_playlists" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"playlist_id" varchar(36) NOT NULL,
	CONSTRAINT "user_library_playlists_id" PRIMARY KEY("user_id","playlist_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_library_songs" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"song_id" varchar(36) NOT NULL,
	CONSTRAINT "user_library_songs_id" PRIMARY KEY("user_id","song_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_recommendations" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(28) NOT NULL,
	"type" varchar(20) NOT NULL,
	"resource_id" varchar(36) NOT NULL,
	"score" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_searches" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(28) NOT NULL,
	"type" varchar(20) NOT NULL,
	"resource_id" varchar(36) NOT NULL,
	CONSTRAINT "user_searches_id" PRIMARY KEY("user_id","type","resource_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_tastes" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"type" varchar(20) NOT NULL,
	"score" numeric NOT NULL,
	"resource_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	CONSTRAINT "user_tastes_id" PRIMARY KEY("type","user_id","resource_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_gifts" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(28) NOT NULL,
	"gift_id" varchar(36) NOT NULL,
	"accepted" boolean,
	CONSTRAINT "users_gifts_id" PRIMARY KEY("user_id","gift_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(28) PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"expo_push_token" varchar(70),
	"country_code" text,
	"original_country_code" text,
	"image" text,
	"flags" jsonb NOT NULL,
	"consumer_id" varchar(36),
	"blurhash" varchar(200),
	"referred_by" varchar(36),
	"last_session" jsonb,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "playlists_title_search_index" ON "playlists" USING gin (to_tsvector('english', "title"));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "artist_idx" ON "song_stats" USING btree ("artist_id");