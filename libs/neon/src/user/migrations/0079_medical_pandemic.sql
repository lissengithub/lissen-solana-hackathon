CREATE TABLE IF NOT EXISTS "fml_user_quiz_history" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contest_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"quiz_question_id" varchar(36) NOT NULL,
	"opened_at" timestamp (6) with time zone NOT NULL,
	"answered_at" timestamp (6) with time zone,
	"answer_id" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL
);
