CREATE TABLE IF NOT EXISTS "vouchers" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"experience_id" varchar(36) NOT NULL,
	"gem_cost" integer NOT NULL,
	"discount_value" integer NOT NULL,
	"visibility" text NOT NULL,
	"reward_type" text NOT NULL,
	"premium_users_only" boolean DEFAULT false NOT NULL,
	"minimum_level_required" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp (6) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_vouchers" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"voucher_id" varchar(36) NOT NULL,
	"user_id" varchar(28) NOT NULL,
	"used" boolean,
	"redeem_code" text
);
--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "raffle_entry_cost" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "experience_id_idx" ON "vouchers" USING btree ("experience_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "voucher_id_idx" ON "users_vouchers" USING btree ("voucher_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "users_vouchers" USING btree ("user_id");