TRUNCATE TABLE "experiences"; --> statement-breakpoint

CREATE TABLE IF NOT EXISTS "experiences_raffle_tickets" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experience_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"amount_commited" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tickets" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"experience_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"default_price" numeric NOT NULL,
	"purchase_price" numeric NOT NULL,
	"claimed" boolean DEFAULT false,
	"redeem_code" varchar(100) NOT NULL,
	"gift_id" varchar(36)
);
--> statement-breakpoint
DROP TABLE "challenges";--> statement-breakpoint
DROP TABLE "items";--> statement-breakpoint
DROP TABLE "marketplaces";--> statement-breakpoint
DROP TABLE "participants_challenges";--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "ticket_amount" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "default_price" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "date_time" timestamp (6) with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "raffle_draw_date_time" timestamp (6) with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "event_info" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "instructions" text;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "instructions_image" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "raffle_tickets" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "experiences" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "experiences" DROP COLUMN IF EXISTS "item_amount";--> statement-breakpoint
ALTER TABLE "experiences" DROP COLUMN IF EXISTS "item_price";--> statement-breakpoint
ALTER TABLE "experiences" DROP COLUMN IF EXISTS "item_info";