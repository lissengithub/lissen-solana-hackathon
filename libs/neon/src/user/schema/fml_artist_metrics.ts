import {
  pgTable,
  integer,
  varchar,
  decimal,
  jsonb,
  bigint,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const fmlArtistMetrics = pgTable(
  "fml_artist_metrics",
  {
    scArtistId: varchar("sc_artist_id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    image: varchar("image", { length: 255 }),
    genres: jsonb("genres").$type<{ name: string; id: string }[]>(),
    totalPoints: integer("total_points").notNull().default(0),
    totalPointsPct: decimal("total_points_pct").notNull().default("0.0"),
    totalBasePoints: integer("total_base_points").notNull().default(0),
    totalEngagementPoints: integer("total_engagement_points")
      .notNull()
      .default(0),

    totalPointsHistory: jsonb("total_points_history")
      .notNull()
      .default(sql`'{}'`)
      .$type<{ date: string; total_points: number }[]>(),

    baseMusicPoints: integer("base_music_points").notNull().default(0),
    baseSocialPoints: integer("base_social_points").notNull().default(0),
    engagementMusicPoints: integer("engagement_music_points")
      .notNull()
      .default(0),
    engagementSocialPoints: integer("engagement_social_points")
      .notNull()
      .default(0),

    spotifyFollowerCount: bigint("spotify_follower_count", { mode: "number" }),
    spotifyFollowerPct: decimal("spotify_follower_pct")
      .notNull()
      .default("0.0"),
    youtubeFollowerCount: bigint("youtube_follower_count", { mode: "number" }),
    youtubeFollowerPct: decimal("youtube_follower_pct")
      .notNull()
      .default("0.0"),
    soundcloudFollowerCount: bigint("soundcloud_follower_count", {
      mode: "number",
    }),
    soundcloudFollowerPct: decimal("soundcloud_follower_pct")
      .notNull()
      .default("0.0"),
    tiktokFollowerCount: bigint("tiktok_follower_count", { mode: "number" }),
    tiktokFollowerPct: decimal("tiktok_follower_pct").notNull().default("0.0"),
    instagramFollowerCount: bigint("instagram_follower_count", {
      mode: "number",
    }),
    instagramFollowerPct: decimal("instagram_follower_pct")
      .notNull()
      .default("0.0"),
    soundcloudPlays: bigint("soundcloud_plays", { mode: "number" }),
    soundcloudPlaysPct: decimal("soundcloud_plays_pct")
      .notNull()
      .default("0.0"),
    spotifyStreams: bigint("spotify_streams", { mode: "number" }),
    spotifyStreamsPct: decimal("spotify_streams_pct").notNull().default("0.0"),
    tiktokStreams: bigint("tiktok_streams", { mode: "number" }),
    tiktokStreamsPct: decimal("tiktok_streams_pct").notNull().default("0.0"),
    youtubeViews: bigint("youtube_views", { mode: "number" }),
    youtubeViewsPct: decimal("youtube_views_pct").notNull().default("0.0"),
  },
  (table) => {
    return {
      totalPointsIdx: index("fml_artist_metrics_total_points_idx").on(
        table.totalPoints,
      ),
      totalPointsPctIdx: index("fml_artist_metrics_total_points_pct_idx").on(
        table.totalPointsPct,
      ),
      nameGinIdx: index("fml_artist_metrics_name_gin_idx").on(
        sql`(${table.name} gin_trgm_ops) USING GIN`,
      ),
    };
  },
);
