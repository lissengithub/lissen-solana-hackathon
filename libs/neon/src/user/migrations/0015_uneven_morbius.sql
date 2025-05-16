DROP TABLE "recommendations_action_points";--> statement-breakpoint
DROP TABLE "recommendations_platform";--> statement-breakpoint
DROP TABLE "recommendations_thresholds";--> statement-breakpoint
DROP TABLE "user_recommendations";--> statement-breakpoint
DROP TABLE "user_tastes";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "raffle_tickets" SET NOT NULL;