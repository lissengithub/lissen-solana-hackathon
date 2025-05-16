CREATE TABLE IF NOT EXISTS "fml_artist_metrics" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"sc_artist_id" varchar NOT NULL,
	"instagram_follower_weight" numeric DEFAULT '0.0' NOT NULL,
	"tiktok_follower_weight" numeric DEFAULT '0.0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fml_artist_points_log" (
	"log_id" serial PRIMARY KEY NOT NULL,
	"sc_artist_id" varchar NOT NULL,
	"platform_name" varchar NOT NULL,
	"metric_type" varchar NOT NULL,
	"platform_content_id" varchar,
	"delta_value" bigint NOT NULL,
	"points_awarded" integer NOT NULL,
	"scrape_ts" timestamp (6) with time zone,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"profile_link" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fml_artist_traits" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"sc_artist_id" varchar NOT NULL,
	"trait_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fml_artists" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"sc_artist_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"image" varchar,
	"instagram_handle" varchar,
	"tiktok_handle" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fml_scrape_artist_content_item_state" (
	"id" serial PRIMARY KEY NOT NULL,
	"sc_artist_id" varchar NOT NULL,
	"platform_name" varchar NOT NULL,
	"platform_content_id" varchar NOT NULL,
	"platform_content_type" varchar NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"scrape_ts" timestamp (6) with time zone NOT NULL,
	"platform_content_created_at" timestamp (6) with time zone NOT NULL,
	"like_count" integer,
	"comment_count" integer,
	"view_count" integer,
	"share_count" integer,
	"ext_link" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fml_scrape_artist_profile_state" (
	"id" serial PRIMARY KEY NOT NULL,
	"sc_artist_id" varchar NOT NULL,
	"platform_name" varchar NOT NULL,
	"platform_id" varchar NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"scrape_ts" timestamp (6) with time zone NOT NULL,
	"follower_count" integer,
	"post_count" integer,
	"tiktok_video_count" integer,
	"tiktok_like_count" integer,
	"ext_link" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fml_traits" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"type" varchar NOT NULL,
	"value" varchar NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fml_artist_points_log_sc_artist_id_idx" ON "fml_artist_points_log" USING btree ("sc_artist_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fml_artist_traits_sc_artist_id_idx" ON "fml_artist_traits" USING btree ("sc_artist_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fml_artist_traits_trait_id_idx" ON "fml_artist_traits" USING btree ("trait_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fml_scrape_artist_content_item_state_sc_artist_id_idx" ON "fml_scrape_artist_content_item_state" USING btree ("sc_artist_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fml_scrape_artist_profile_state_sc_artist_id_idx" ON "fml_scrape_artist_profile_state" USING btree ("sc_artist_id");