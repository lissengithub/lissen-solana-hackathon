DROP TABLE "gifts";--> statement-breakpoint
DROP TABLE "song_stats";--> statement-breakpoint
DROP TABLE "stubbed_data";--> statement-breakpoint
DROP TABLE "users_gifts";--> statement-breakpoint
ALTER TABLE "tickets" DROP COLUMN IF EXISTS "gift_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "raffle_tickets";