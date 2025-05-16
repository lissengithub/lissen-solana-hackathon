CREATE TABLE IF NOT EXISTS "fml_artist_user_points" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"sc_artist_id" varchar(36),
	"user_id" varchar(36),
	"points" integer NOT NULL,
	"contest_id" varchar(36) NOT NULL,
	"artist_points_log_id" integer,
	"date" date NOT NULL,
	CONSTRAINT "fml_artist_user_points_pk" PRIMARY KEY("sc_artist_id","user_id","contest_id","date")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fml_artist_user_points_sc_artist_id_idx" ON "fml_artist_user_points" USING btree ("sc_artist_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fml_artist_user_points_user_id_idx" ON "fml_artist_user_points" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fml_artist_user_points_contest_id_idx" ON "fml_artist_user_points" USING btree ("contest_id");