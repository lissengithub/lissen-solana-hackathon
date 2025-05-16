CREATE TABLE IF NOT EXISTS "user_favourites_top_10" (
	"updated_at" timestamp (6) with time zone NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"collection_id" varchar(36) NOT NULL,
	"collection_type" varchar(20) NOT NULL,
	"total_score" numeric NOT NULL,
	CONSTRAINT "user_favourites_top_10_id" PRIMARY KEY("user_id","collection_id")
);
