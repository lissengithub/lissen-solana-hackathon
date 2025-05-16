CREATE TABLE IF NOT EXISTS "fml_artist_points" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"artist_id" varchar(36) PRIMARY KEY NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"history" integer[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
DROP TABLE "fml_artist_stats";--> statement-breakpoint
DROP TABLE "fml_roster_stats";--> statement-breakpoint
ALTER TABLE "fml_contest_leaderboards" RENAME COLUMN "points" TO "total_score";--> statement-breakpoint
ALTER TABLE "fml_contest_leaderboards" DROP CONSTRAINT "fml_contest_leaderboards_contest_id_fml_contests_id_fk";
--> statement-breakpoint
ALTER TABLE "fml_contest_leaderboards" DROP CONSTRAINT "fml_contest_leaderboards_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "fml_contest_prizes" DROP CONSTRAINT "fml_contest_prizes_contest_id_fml_contests_id_fk";
--> statement-breakpoint
ALTER TABLE "fml_rosters" DROP CONSTRAINT "fml_rosters_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "fml_contest_leaderboards" DROP CONSTRAINT "fml_contest_leaderboards_contest_id_week_user_id_pk";--> statement-breakpoint
ALTER TABLE "fml_contest_leaderboards" ADD COLUMN "date" timestamp (6) with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_contest_leaderboards" ADD CONSTRAINT "fml_contest_leaderboards_contest_id_date_user_id_pk" PRIMARY KEY("contest_id","date","user_id");--> statement-breakpoint
ALTER TABLE "fml_contest_leaderboards" ADD COLUMN "roster_history" jsonb DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_contests" ADD COLUMN "start_date" timestamp (6) with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_contests" ADD COLUMN "end_date" timestamp (6) with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_contest_leaderboards" DROP COLUMN IF EXISTS "week";--> statement-breakpoint
ALTER TABLE "fml_contests" DROP COLUMN IF EXISTS "week";