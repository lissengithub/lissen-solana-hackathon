CREATE TABLE IF NOT EXISTS "recommendations_global_artist_popular_songs" (
	"artist_id" varchar(36) PRIMARY KEY NOT NULL,
	"song_ids" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations_global_artist" (
	"artist_id" varchar(36) PRIMARY KEY NOT NULL,
	"recommendation_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations_global_discover_daily" (
	"recommendation_id" varchar(36) NOT NULL,
	"song_id" varchar(36) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations_global_for_you" (
	"recommendation_id" varchar(36) NOT NULL,
	"resource_id" varchar(36) PRIMARY KEY NOT NULL,
	"resource_type" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations_global_genre_album" (
	"album_id" varchar(36) NOT NULL,
	"album_rank" integer NOT NULL,
	"genre_id" varchar(36) NOT NULL,
	CONSTRAINT "recommendations_global_genre_album_id" PRIMARY KEY("genre_id","album_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations_global_genre" (
	"genre_id" varchar(36) PRIMARY KEY NOT NULL,
	"genre_rank" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations_global_playlist" (
	"playlist_id" varchar(36) PRIMARY KEY NOT NULL,
	"playlist_rank" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations_global_todays_top_hits" (
	"song_id" varchar(36) PRIMARY KEY NOT NULL,
	"song_rank" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations_user_artist" (
	"artist_id" varchar(36) NOT NULL,
	"rank" integer NOT NULL,
	"recommendation_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	CONSTRAINT "recommendations_user_artist_id" PRIMARY KEY("user_id","artist_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations_user_discover_daily" (
	"rank" integer NOT NULL,
	"recommendation_id" varchar(36) NOT NULL,
	"song_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	CONSTRAINT "recommendations_user_discover_daily_id" PRIMARY KEY("user_id","song_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations_user_for_you" (
	"rank" integer NOT NULL,
	"recommendation_id" varchar(36) NOT NULL,
	"resource_id" varchar(36) NOT NULL,
	"resource_type" varchar NOT NULL,
	"user_id" varchar(36) NOT NULL,
	CONSTRAINT "recommendations_user_for_you_id" PRIMARY KEY("user_id","resource_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations_user_playlist" (
	"playlist_id" varchar(36) NOT NULL,
	"rank" integer NOT NULL,
	"recommendation_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	CONSTRAINT "recommendations_user_playlist_id" PRIMARY KEY("user_id","playlist_id")
);
