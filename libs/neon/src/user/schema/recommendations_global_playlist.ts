import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const recommendationsGlobalPlaylist = pgTable(
  "recommendations_global_playlist",
  {
    playlistId: varchar("playlist_id", { length: 36 }).primaryKey().notNull(),
    playlistRank: integer("playlist_rank").notNull(),
  },
);
