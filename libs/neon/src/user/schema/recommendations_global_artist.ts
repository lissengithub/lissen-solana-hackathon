import { pgTable, varchar } from "drizzle-orm/pg-core";

export const recommendationsGlobalArtist = pgTable(
  "recommendations_global_artist",
  {
    artistId: varchar("artist_id", { length: 36 }).primaryKey().notNull(),
    recommendationId: varchar("recommendation_id", { length: 73 }).notNull(),
  },
);
