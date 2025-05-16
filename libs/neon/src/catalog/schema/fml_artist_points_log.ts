import {
  varchar,
  pgTable,
  integer,
  serial,
  bigint,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { fmlArtists } from "./fml_artists";
import { timestampWithTimezone } from "../../utils/fields";

export const fmlArtistPointsLog = pgTable(
  "fml_artist_points_log",
  {
    logId: serial("log_id").primaryKey(),
    scArtistId: varchar("sc_artist_id").notNull(),
    platformName: varchar("platform_name")
      .$type<"instagram" | "tiktok">()
      .notNull(),
    metricType: varchar("metric_type").$type<"follower_delta">().notNull(),
    platformContentId: varchar("platform_content_id"),
    deltaValue: bigint("delta_value", { mode: "number" }).notNull(),
    pointsAwarded: integer("points_awarded").notNull(),
    scrapeTs: timestampWithTimezone("scrape_ts"),
    createdAt: timestampWithTimezone("created_at")
      .notNull()
      .default(sql`now()`),
    profileLink: varchar("profile_link").notNull(),
  },
  (table) => ({
    fmlArtistPointsLogScArtistIdIdx: index(
      "fml_artist_points_log_sc_artist_id_idx",
    ).on(table.scArtistId),
  }),
);

export type FmlArtistPointsLog = typeof fmlArtistPointsLog.$inferSelect;

export const fmlArtistPointsLogRelations = relations(
  fmlArtistPointsLog,
  ({ one }) => ({
    artist: one(fmlArtists, {
      fields: [fmlArtistPointsLog.scArtistId],
      references: [fmlArtists.scArtistId],
    }),
  }),
);
