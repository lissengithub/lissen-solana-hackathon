CREATE TABLE IF NOT EXISTS "videocall_events" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_payload" jsonb NOT NULL,
	"event_timestamp" bigint NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"videocall_id" varchar(36) NOT NULL
);
