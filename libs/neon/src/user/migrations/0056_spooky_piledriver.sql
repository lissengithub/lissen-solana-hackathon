CREATE TABLE IF NOT EXISTS "access_type_merch" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"access_id" varchar(36) PRIMARY KEY NOT NULL,
	"item" text NOT NULL,
	"instructions" text
);--> statement-breakpoint
INSERT INTO access_type_merch SELECT created_at, updated_at, id AS access_id, COALESCE(instructions, 'Item') AS item, NULL AS instructions FROM experiences WHERE type = 'bonus';--> statement-breakpoint
