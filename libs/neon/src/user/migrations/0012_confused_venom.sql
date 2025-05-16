CREATE TABLE IF NOT EXISTS "recommendations" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"date" timestamp (6) with time zone NOT NULL,
	"type" varchar NOT NULL,
	"resources" jsonb NOT NULL,
	"recomm_id" varchar NOT NULL,
	"user_id" varchar(36) NOT NULL,
	CONSTRAINT "recommendations_id" PRIMARY KEY("user_id","type","date")
);
--> statement-breakpoint
DROP TABLE "discover_dailies";--> statement-breakpoint
DROP TABLE "for_yous";