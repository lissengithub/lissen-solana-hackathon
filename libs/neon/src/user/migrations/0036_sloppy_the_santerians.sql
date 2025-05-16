CREATE TABLE IF NOT EXISTS "artists_user_leaderboard" (
	"artist_id" varchar(36) NOT NULL,
	"timestamp" timestamp (6) with time zone NOT NULL,
	"user_id" varchar(28) NOT NULL,
	"user_rank" integer NOT NULL,
	CONSTRAINT "artists_user_leaderboard_id" PRIMARY KEY("artist_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_artist_leaderboard" (
	"artist_id" varchar(36) NOT NULL,
	"artist_rank" integer NOT NULL,
	"timestamp" timestamp (6) with time zone NOT NULL,
	"user_id" varchar(28) NOT NULL,
	CONSTRAINT "users_artist_leaderboard_id" PRIMARY KEY("user_id","artist_id")
);
