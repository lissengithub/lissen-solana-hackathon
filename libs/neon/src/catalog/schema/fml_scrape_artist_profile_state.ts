import { varchar, pgTable, integer, serial, index } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { timestampWithTimezone } from "../../utils/fields";
import { fmlArtists } from "./fml_artists";

export const fmlScrapeArtistProfileState = pgTable(
  "fml_scrape_artist_profile_state",
  {
    id: serial("id").primaryKey(),
    scArtistId: varchar("sc_artist_id").notNull(),
    platformName: varchar("platform_name")
      .$type<"instagram" | "tiktok">()
      .notNull(),
    platformId: varchar("platform_id").notNull(),
    createdAt: timestampWithTimezone("created_at")
      .notNull()
      .default(sql`now()`),
    scrapeTs: timestampWithTimezone("scrape_ts").notNull(),
    followerCount: integer("follower_count"),
    postCount: integer("post_count"),
    tiktokVideoCount: integer("tiktok_video_count"),
    tiktokLikeCount: integer("tiktok_like_count"),
    extLink: varchar("ext_link").notNull(),
  },
  (table) => ({
    fmlScrapeArtistProfileStateScArtistIdIdx: index(
      "fml_scrape_artist_profile_state_sc_artist_id_idx",
    ).on(table.scArtistId),
  }),
);

export type FmlScrapeArtistProfileState =
  typeof fmlScrapeArtistProfileState.$inferSelect;

export const ffmlScrapeArtistProfileStateRelations = relations(
  fmlScrapeArtistProfileState,
  ({ one }) => ({
    artist: one(fmlArtists, {
      fields: [fmlScrapeArtistProfileState.scArtistId],
      references: [fmlArtists.scArtistId],
    }),
  }),
);
