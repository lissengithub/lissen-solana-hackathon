CREATE TABLE IF NOT EXISTS "videocall" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experience_id" varchar(36) NOT NULL,
	"start_time" timestamp (6) with time zone NOT NULL,
	"artist_join_time" timestamp (6) with time zone,
	"duration" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "videocall_participants" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"videocall_id" varchar(36) NOT NULL,
	"user_id" varchar(28) NOT NULL,
	CONSTRAINT "videocall_participants_user_videocall_id" PRIMARY KEY("user_id","videocall_id")
);
