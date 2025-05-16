CREATE TABLE IF NOT EXISTS "marketplaces" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"allocated_items" integer NOT NULL,
	"display_price" varchar(16) NOT NULL,
	"experience_id" varchar(36) NOT NULL,
	"ext_link" text NOT NULL,
	"percentage_discount" real DEFAULT 0,
	"start_time" timestamp (6) with time zone NOT NULL
);
