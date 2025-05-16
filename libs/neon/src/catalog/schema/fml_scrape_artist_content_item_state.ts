import { varchar, pgTable, integer, serial, index } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { timestampWithTimezone } from "../../utils/fields";
import { fmlArtists } from "./fml_artists";

export const fmlScrapeArtistContentItemState = pgTable(
  "fml_scrape_artist_content_item_state",
  {
    id: serial("id").primaryKey(),
    scArtistId: varchar("sc_artist_id").notNull(),
    platformName: varchar("platform_name")
      .$type<"instagram" | "tiktok">()
      .notNull(),
    platformContentId: varchar("platform_content_id").notNull(),
    platformContentType: varchar("platform_content_type").notNull(),
    createdAt: timestampWithTimezone("created_at")
      .notNull()
      .default(sql`now()`),
    scrapeTs: timestampWithTimezone("scrape_ts").notNull(),
    platformContentCreatedAt: timestampWithTimezone(
      "platform_content_created_at",
    ).notNull(),
    likeCount: integer("like_count"),
    commentCount: integer("comment_count"),
    viewCount: integer("view_count"),
    shareCount: integer("share_count"),
    extLink: varchar("ext_link").notNull(),
  },
  (table) => ({
    fmlScrapeArtistContentItemStateScArtistIdIdx: index(
      "fml_scrape_artist_content_item_state_sc_artist_id_idx",
    ).on(table.scArtistId),
  }),
);

export type FmlScrapeArtistContentItemState =
  typeof fmlScrapeArtistContentItemState.$inferSelect;

export const fmlScrapeArtistContentItemStateRelations = relations(
  fmlScrapeArtistContentItemState,
  ({ one }) => ({
    artist: one(fmlArtists, {
      fields: [fmlScrapeArtistContentItemState.scArtistId],
      references: [fmlArtists.scArtistId],
    }),
  }),
);
