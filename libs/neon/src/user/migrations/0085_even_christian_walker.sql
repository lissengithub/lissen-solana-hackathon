CREATE TABLE IF NOT EXISTS "fml_feed_likes" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar NOT NULL,
	"log_id" integer NOT NULL,
	CONSTRAINT "fml_feed_likes_id" PRIMARY KEY("user_id","log_id")
);
