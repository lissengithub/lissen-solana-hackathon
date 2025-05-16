ALTER TABLE "fml_rosters" ADD COLUMN "league_id" varchar(36) NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE "fml_rosters" DROP CONSTRAINT IF EXISTS "fml_rosters_user_id_sc_artist_id_pk";--> statement-breakpoint
ALTER TABLE "fml_rosters" ADD CONSTRAINT "fml_rosters_user_id_sc_artist_id_league_id_pk" PRIMARY KEY("user_id","sc_artist_id","league_id");--> statement-breakpoint
