CREATE TABLE IF NOT EXISTS "for_yous" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"date" timestamp (6) with time zone NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"items" jsonb NOT NULL,
	CONSTRAINT "for_yous_id" PRIMARY KEY("user_id","date")
);
