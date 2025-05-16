import { integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

export const recommendationsUserArtist = pgTable(
  "recommendations_user_artist",
  {
    artistId: varchar("artist_id", { length: 36 }).notNull(),
    rank: integer("rank").notNull(),
    recommendationId: varchar("recommendation_id", { length: 73 }).notNull(),
    userId: varchar("user_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      recommendationsUserArtistId: primaryKey({
        columns: [table.userId, table.artistId],
        name: "recommendations_user_artist_id",
      }),
    };
  },
);
