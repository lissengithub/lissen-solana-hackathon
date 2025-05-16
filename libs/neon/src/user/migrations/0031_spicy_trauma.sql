ALTER TABLE "experiences" ALTER COLUMN "raffle_entry_cost" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "experiences" ALTER COLUMN "raffle_entry_cost" SET DEFAULT '1.00';--> statement-breakpoint
ALTER TABLE "vouchers" ALTER COLUMN "discount_value" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "users_vouchers" ALTER COLUMN "used" SET NOT NULL;