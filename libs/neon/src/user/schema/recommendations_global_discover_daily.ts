import { pgTable, varchar } from "drizzle-orm/pg-core";

export const recommendationsGlobalDiscoverDaily = pgTable(
  "recommendations_global_discover_daily",
  {
    recommendationId: varchar("recommendation_id", { length: 73 }).notNull(),
    songId: varchar("song_id", { length: 36 }).primaryKey().notNull(),
  },
);
