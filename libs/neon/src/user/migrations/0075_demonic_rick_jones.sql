CREATE TABLE IF NOT EXISTS "fml_quiz_questions" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_text" text NOT NULL,
	"answers" jsonb NOT NULL,
	"correct_answer_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fml_quiz_traits" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_question_id" text NOT NULL,
	"trait_id" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
