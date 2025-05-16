import { varchar, pgTable, index } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { relations, sql } from "drizzle-orm";
import { fmlArtistMetrics } from "./fml_artist_metrics";
import { fmlArtistTraits } from "./fml_artist_traits";

export const fmlArtists = pgTable(
  "fml_artists",
  {
    ...timestamps,
    scArtistId: varchar("sc_artist_id").primaryKey().notNull(),
    name: varchar("name").notNull(),
    image: varchar("image"),
    instagramHandle: varchar("instagram_handle"),
    tiktokHandle: varchar("tiktok_handle"),
  },
  (table) => {
    return {
      nameGinIdx: index("fml_artists_name_gin_idx").on(
        sql`(${table.name} gin_trgm_ops) USING GIN`,
      ),
    };
  },
);

export type FmlArtists = typeof fmlArtists.$inferSelect;

export const fmlArtistsRelations = relations(fmlArtists, ({ one, many }) => ({
  metrics: one(fmlArtistMetrics, {
    fields: [fmlArtists.scArtistId],
    references: [fmlArtistMetrics.scArtistId],
  }),
  traits: many(fmlArtistTraits),
}));
