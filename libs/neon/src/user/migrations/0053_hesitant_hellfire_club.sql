ALTER TABLE "experience_collaborators" RENAME TO "access_collaborators";--> statement-breakpoint
ALTER TABLE "access_collaborators" RENAME COLUMN "experience_id" TO "access_id";--> statement-breakpoint
ALTER TABLE "access_collaborators" ADD CONSTRAINT "access_collaborators_access_id_artist_id" PRIMARY KEY("access_id","artist_id");