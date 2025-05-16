import { varchar, pgTable, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { fmlArtists } from "./fml_artists";

export const fmlArtistMetrics = pgTable("fml_artist_metrics", {
  scArtistId: varchar("sc_artist_id").notNull(),
  instagramFollowerCount: integer("instagram_follower_count"),
  tiktokFollowerCount: integer("tiktok_follower_count"),
});

export type FmlArtistMetrics = typeof fmlArtistMetrics.$inferSelect;

export const fmlArtistMetricsRelations = relations(
  fmlArtistMetrics,
  ({ one }) => ({
    artist: one(fmlArtists, {
      fields: [fmlArtistMetrics.scArtistId],
      references: [fmlArtists.scArtistId],
    }),
  }),
);
