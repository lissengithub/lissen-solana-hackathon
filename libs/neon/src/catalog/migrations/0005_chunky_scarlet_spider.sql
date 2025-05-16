ALTER TABLE "live_albums" ADD COLUMN "created_at" timestamp (6) with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "live_albums" ADD COLUMN "updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "live_artists" ADD COLUMN "created_at" timestamp (6) with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "live_artists" ADD COLUMN "updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "live_songs" ADD COLUMN "created_at" timestamp (6) with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "live_songs" ADD COLUMN "updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL;