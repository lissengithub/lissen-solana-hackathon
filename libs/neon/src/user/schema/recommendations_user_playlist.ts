import { integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

export const recommendationsUserPlaylist = pgTable(
  "recommendations_user_playlist",
  {
    playlistId: varchar("playlist_id", { length: 36 }).notNull(),
    rank: integer("rank").notNull(),
    recommendationId: varchar("recommendation_id", { length: 73 }).notNull(),
    userId: varchar("user_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      recommendationsUserPlaylistId: primaryKey({
        columns: [table.userId, table.playlistId],
        name: "recommendations_user_playlist_id",
      }),
    };
  },
);
