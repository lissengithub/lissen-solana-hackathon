import { varchar, integer, decimal, pgTable } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { liveArtists } from "./live_artists";

export const liveArtistCatalogCoverage = pgTable(
  "live_artist_catalog_coverage",
  {
    id: varchar("id").primaryKey(),
    lissen_songs: integer("lissen_songs"),
    sc_songs: integer("sc_songs"),
    sc_catalog_coverage: decimal("sc_catalog_coverage"),
  },
);

export const liveArtistCatalogCoverageRelations = relations(
  liveArtistCatalogCoverage,
  ({ one }) => ({
    artist: one(liveArtists, {
      fields: [liveArtistCatalogCoverage.id],
      references: [liveArtists.id],
    }),
  }),
);
