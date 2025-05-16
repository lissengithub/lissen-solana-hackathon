import { integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

export const recommendationsUserDiscoverDaily = pgTable(
  "recommendations_user_discover_daily",
  {
    rank: integer("rank").notNull(),
    recommendationId: varchar("recommendation_id", { length: 73 }).notNull(),
    songId: varchar("song_id", { length: 36 }).notNull(),
    userId: varchar("user_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      recommendationsUserDiscoverDailyId: primaryKey({
        columns: [table.userId, table.songId],
        name: "recommendations_user_discover_daily_id",
      }),
    };
  },
);
