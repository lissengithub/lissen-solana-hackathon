CREATE TABLE IF NOT EXISTS "fml_contest_quizes" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contest_id" varchar(36) NOT NULL,
	"quiz_question_id" varchar(36) NOT NULL,
	"date" timestamp (6) with time zone NOT NULL,
	"points_value" integer DEFAULT 0 NOT NULL
);
