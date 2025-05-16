import { pgTable, integer, varchar } from "drizzle-orm/pg-core";

export const recommendationsGlobalGenre = pgTable(
  "recommendations_global_genre",
  {
    genreId: varchar("genre_id", { length: 36 }).primaryKey().notNull(),
    genreRank: integer("genre_rank").notNull(),
  },
);
