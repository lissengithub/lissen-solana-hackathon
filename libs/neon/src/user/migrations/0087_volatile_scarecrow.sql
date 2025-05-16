CREATE TABLE IF NOT EXISTS "sol_master" (
	"public_key" varchar NOT NULL,
	"secret_key" varchar NOT NULL,
	"lissen_gem_mint_address" varchar NOT NULL,
	"lissen_gem_wallet_address" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sol_user_wallets" (
	"user_id" varchar(36) NOT NULL,
	"public_key" varchar NOT NULL,
	"secret_key" varchar NOT NULL
);