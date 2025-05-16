ALTER TABLE "artists_albums" DROP CONSTRAINT "artists_albums_constraint";--> statement-breakpoint
ALTER TABLE "artists_songs" DROP CONSTRAINT "artists_songs_constraint";--> statement-breakpoint
ALTER TABLE "artists_albums" ADD CONSTRAINT "artists_albums_key" PRIMARY KEY("artist_id","album_id","role");--> statement-breakpoint
ALTER TABLE "artists_songs" ADD CONSTRAINT "artists_songs_key" PRIMARY KEY("artist_id","song_id","role");--> statement-breakpoint
ALTER TABLE "rights_holders" ADD COLUMN "name2" jsonb;--> statement-breakpoint
UPDATE "rights_holders" set name2 = CAST(name as JSONB);--> statement-breakpoint
ALTER TABLE "rights_holders" DROP COLUMN name;--> statement-breakpoint
ALTER TABLE "rights_holders" RENAME COLUMN name2 TO name;
--> statement-breakpoint
ALTER TABLE "rights_holders" ALTER COLUMN name SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "rights_holders" ADD CONSTRAINT "rights_holders_id" PRIMARY KEY("name","type");
--> statement-breakpoint