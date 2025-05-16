CREATE TABLE IF NOT EXISTS "users_streak" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(28) PRIMARY KEY NOT NULL,
	"streak" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_gems" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(28) PRIMARY KEY NOT NULL,
	"gems" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "streak";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "gems";