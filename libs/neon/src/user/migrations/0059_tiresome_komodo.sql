CREATE TABLE IF NOT EXISTS "fml_artist_stats" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"artist_id" varchar(36) NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"percent_change" numeric(5, 2) DEFAULT '0' NOT NULL,
	"roster_gem_cost" integer DEFAULT 0 NOT NULL,
	"week" integer NOT NULL,
	CONSTRAINT "fml_artist_stats_artist_id_week_pk" PRIMARY KEY("artist_id","week")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fml_contest_leaderboards" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"contest_id" varchar(36) NOT NULL,
	"week" integer NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"rank" integer NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "fml_contest_leaderboards_contest_id_week_user_id_pk" PRIMARY KEY("contest_id","week","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fml_contest_prizes" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contest_id" varchar(36) NOT NULL,
	"rank_start" integer NOT NULL,
	"rank_end" integer NOT NULL,
	"prize_description" text NOT NULL,
	"prize_type" varchar(50) NOT NULL,
	"prize_value" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fml_contests" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"about" text,
	"how_it_works" text,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fml_roster_stats" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"artist_id" varchar(36) NOT NULL,
	"contest_id" varchar(36) NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"week" integer NOT NULL,
	CONSTRAINT "fml_roster_stats_user_id_artist_id_contest_id_week_pk" PRIMARY KEY("user_id","artist_id","contest_id","week")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fml_rosters" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"artist_id" varchar(36) NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "fml_rosters_user_id_artist_id_pk" PRIMARY KEY("user_id","artist_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fml_contest_leaderboards" ADD CONSTRAINT "fml_contest_leaderboards_contest_id_fml_contests_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."fml_contests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fml_contest_leaderboards" ADD CONSTRAINT "fml_contest_leaderboards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fml_contest_prizes" ADD CONSTRAINT "fml_contest_prizes_contest_id_fml_contests_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."fml_contests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fml_roster_stats" ADD CONSTRAINT "fml_roster_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fml_roster_stats" ADD CONSTRAINT "fml_roster_stats_contest_id_fml_contests_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."fml_contests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fml_rosters" ADD CONSTRAINT "fml_rosters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
