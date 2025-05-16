ALTER TABLE "recommendations_global_artist" ALTER COLUMN "recommendation_id" SET DATA TYPE varchar(73);--> statement-breakpoint
ALTER TABLE "recommendations_global_discover_daily" ALTER COLUMN "recommendation_id" SET DATA TYPE varchar(73);--> statement-breakpoint
ALTER TABLE "recommendations_global_for_you" ALTER COLUMN "recommendation_id" SET DATA TYPE varchar(73);--> statement-breakpoint
ALTER TABLE "recommendations_user_artist" ALTER COLUMN "recommendation_id" SET DATA TYPE varchar(73);--> statement-breakpoint
ALTER TABLE "recommendations_user_discover_daily" ALTER COLUMN "recommendation_id" SET DATA TYPE varchar(73);--> statement-breakpoint
ALTER TABLE "recommendations_user_for_you" ALTER COLUMN "recommendation_id" SET DATA TYPE varchar(73);--> statement-breakpoint
ALTER TABLE "recommendations_user_playlist" ALTER COLUMN "recommendation_id" SET DATA TYPE varchar(73);