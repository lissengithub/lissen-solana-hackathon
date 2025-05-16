import { pgTable, varchar, integer } from "drizzle-orm/pg-core";

export const recommendationsGlobalTodaysTopHits = pgTable(
  "recommendations_global_todays_top_hits",
  {
    songId: varchar("song_id", { length: 36 }).primaryKey().notNull(),
    songRank: integer("song_rank").notNull(),
  },
);
