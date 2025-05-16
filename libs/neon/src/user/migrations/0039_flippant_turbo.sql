ALTER TABLE "users_streak" ADD COLUMN "timestamp" timestamp (6) with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users_streak" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "users_streak" DROP COLUMN IF EXISTS "updated_at";