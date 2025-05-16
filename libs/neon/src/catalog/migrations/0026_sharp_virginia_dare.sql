CREATE TABLE IF NOT EXISTS "fml_points_value_thresholds" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_type" varchar NOT NULL,
	"min_value" integer NOT NULL,
	"max_value" integer,
	"value" integer NOT NULL
);--> statement-breakpoint

INSERT INTO "fml_points_value_thresholds" ("metric_type", "min_value", "max_value", "value")
VALUES
('instagram_followers', 0, 5000, 100),
('instagram_followers', 5001, 10000, 150),
('instagram_followers', 10001, NULL, 300)
