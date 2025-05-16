CREATE TABLE IF NOT EXISTS "fml_artist_mapping" (
	"sc_artist_id" varchar(36) PRIMARY KEY NOT NULL,
	"lissen_artist_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fml_artist_mapping_lissen_artist_id_idx" ON "fml_artist_mapping" USING btree ("lissen_artist_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fml_artist_mapping_sc_artist_id_idx" ON "fml_artist_mapping" USING btree ("sc_artist_id");