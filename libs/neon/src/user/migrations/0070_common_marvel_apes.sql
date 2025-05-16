
TRUNCATE TABLE "fml_artist_metrics"; --> statement-breakpoint
ALTER TABLE "fml_artist_metrics" RENAME COLUMN "artist_id" TO "sc_artist_id";--> statement-breakpoint

ALTER TABLE "fml_artist_metrics" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" ADD COLUMN "image" varchar(255);--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "lissen_streams";--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "lissen_streams_pct";--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "total_base_points_pct";--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "total_engagement_points_pct";--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "base_music_points_pct";--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "base_social_points_pct";--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "engagement_music_points_pct";--> statement-breakpoint
ALTER TABLE "fml_artist_metrics" DROP COLUMN IF EXISTS "engagement_social_points_pct";

UPDATE fml_rosters rosters
SET artist_id = mapping.sc_artist_id
FROM fml_artist_mapping mapping
WHERE rosters.artist_id = mapping.lissen_artist_id; --> statement-breakpoint

ALTER TABLE "fml_rosters" RENAME COLUMN "artist_id" TO "sc_artist_id";--> statement-breakpoint
ALTER TABLE "fml_rosters" DROP CONSTRAINT "fml_rosters_user_id_artist_id_pk";--> statement-breakpoint
ALTER TABLE "fml_rosters" ADD CONSTRAINT "fml_rosters_user_id_sc_artist_id_pk" PRIMARY KEY("user_id","sc_artist_id");--> statement-breakpoint

-- Update artist_id within the roster_history JSONB column in fml_contest_leaderboards
WITH unpacked_roster AS (
    -- Unpack the roster_history array for each leaderboard entry
    SELECT
        contest_id,
        user_id,
        date,
        jsonb_array_elements(roster_history) AS roster_item
    FROM fml_contest_leaderboards
),
mapped_roster AS (
    -- Join with the mapping table to get the sc_artist_id
    SELECT
        u.contest_id,
        u.user_id,
        u.date,
        -- Reconstruct the JSON object with sc_artist_id
        jsonb_set(
            u.roster_item - 'artist_id', -- Remove the old 'artist_id' key
            '{sc_artist_id}', -- Define the path for the new key
            to_jsonb(m.sc_artist_id) -- Set the new value (ensure it's JSONB)
        ) AS updated_roster_item
    FROM unpacked_roster u
    JOIN fml_artist_mapping m ON (u.roster_item ->> 'artist_id') = m.lissen_artist_id -- Match on the Lissen ID
),
repacked_roster AS (
    -- Aggregate the updated items back into an array for each leaderboard entry
    SELECT
        contest_id,
        user_id,
        date,
        jsonb_agg(updated_roster_item) AS new_roster_history
    FROM mapped_roster
    GROUP BY contest_id, user_id, date
)
-- Update the original table
UPDATE fml_contest_leaderboards l
SET roster_history = r.new_roster_history
FROM repacked_roster r
WHERE l.contest_id = r.contest_id
  AND l.user_id = r.user_id
  AND l.date = r.date; --> statement-breakpoint