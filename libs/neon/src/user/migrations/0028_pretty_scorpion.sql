CREATE TABLE IF NOT EXISTS "claimed_gems" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(28) NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"action" text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "claimed_gems_unique_idx" ON "claimed_gems" USING btree ("user_id","resource_type","resource_id","action");