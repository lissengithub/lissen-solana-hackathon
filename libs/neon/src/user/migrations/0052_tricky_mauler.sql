CREATE TABLE IF NOT EXISTS "access_bonus_directs" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"access_id" varchar(36) NOT NULL,
	"gem_cost" integer NOT NULL,
	"start_date" timestamp (6) with time zone NOT NULL,
	"reward_count_per_winner" integer NOT NULL,
	"number_of_winners" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "access_bonus_giveaways" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"access_id" varchar(36) NOT NULL,
	"gem_cost" integer NOT NULL,
	"start_date" timestamp (6) with time zone NOT NULL,
	"reward_count_per_winner" integer NOT NULL,
	"number_of_winners" integer NOT NULL,
	"raffle_date" timestamp (6) with time zone NOT NULL,
	"raffle_has_drawn" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "access_type_concert" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"access_id" varchar(36) NOT NULL,
	"date_time" timestamp (6) with time zone NOT NULL,
	"city" text NOT NULL,
	"venue" text NOT NULL,
	"instructions" text,
	"instructions_image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accesses" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artist_id" varchar(36) NOT NULL,
	"ext_link" text DEFAULT '' NOT NULL,
	"default_price" numeric NOT NULL,
	"ticket_amount" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"image" text,
	"boost" integer DEFAULT 0 NOT NULL,
	"is_pinned" boolean,
	"is_bonus_only" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "experiences_raffle_tickets" RENAME TO "access_bonus_giveaway_tickets";--> statement-breakpoint
ALTER TABLE "tickets" RENAME TO "access_tickets";--> statement-breakpoint
ALTER TABLE "users_vouchers" RENAME TO "access_users_vouchers";--> statement-breakpoint
ALTER TABLE "vouchers" RENAME TO "access_vouchers";--> statement-breakpoint
ALTER TABLE "access_bonus_giveaway_tickets" RENAME COLUMN "experience_id" TO "access_id";--> statement-breakpoint
ALTER TABLE "gem_transaction_history" RENAME COLUMN "experience_id" TO "access_id";--> statement-breakpoint
ALTER TABLE "gem_transaction_history" RENAME COLUMN "user_voucher_id" TO "access_user_voucher_id";--> statement-breakpoint
ALTER TABLE "access_tickets" RENAME COLUMN "experience_id" TO "access_id";--> statement-breakpoint
ALTER TABLE "access_users_vouchers" RENAME COLUMN "voucher_id" TO "access_voucher_id";--> statement-breakpoint
ALTER TABLE "videocall" RENAME COLUMN "experience_id" TO "access_id";--> statement-breakpoint
ALTER TABLE "access_vouchers" RENAME COLUMN "experience_id" TO "access_id";--> statement-breakpoint
DROP INDEX IF EXISTS "gem_transaction_history_experience_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "gem_transaction_history_user_voucher_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "voucher_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "experience_id_idx";--> statement-breakpoint
ALTER TABLE "experience_collaborators" DROP CONSTRAINT "experience_collaborators_id";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gem_transaction_history_access_idx" ON "gem_transaction_history" USING btree ("action","access_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gem_transaction_history_access_user_voucher_idx" ON "gem_transaction_history" USING btree ("action","user_id","access_user_voucher_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "access_users_vouchers_access_voucher_id_idx" ON "access_users_vouchers" USING btree ("access_voucher_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "access_users_vouchers_user_id_idx" ON "access_users_vouchers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "access_vouchers_access_id_idx" ON "access_vouchers" USING btree ("access_id");