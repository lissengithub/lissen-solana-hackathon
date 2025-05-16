CREATE TABLE IF NOT EXISTS "access_type_song_owners" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"access_type_song_id" varchar(36) NOT NULL,
	"user_id" varchar(28) NOT NULL,
	CONSTRAINT "access_type_song_owners_id" PRIMARY KEY("access_type_song_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "access_type_song" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"access_id" varchar(36) NOT NULL,
	"song_id" varchar(36) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "access_bonus_giveaway_tickets" ADD COLUMN "bonus_giveaway_id" varchar(36);--> statement-breakpoint
ALTER TABLE "gem_transaction_history" ADD COLUMN "bonus_giveaway_id" varchar(36);--> statement-breakpoint
ALTER TABLE "playlists" ADD COLUMN "has_private_song" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gem_transaction_history_bonus_giveaway_idx" ON "gem_transaction_history" USING btree ("action","user_id","bonus_giveaway_id");