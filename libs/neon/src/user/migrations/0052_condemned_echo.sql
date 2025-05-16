CREATE TABLE IF NOT EXISTS "access_type_content_owners" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"access_id" varchar(36) NOT NULL,
	"user_id" varchar(28) NOT NULL,
	"song_id" varchar(36) NOT NULL,
	CONSTRAINT "access_type_content_owners_id" PRIMARY KEY("access_id","user_id","song_id")
);
