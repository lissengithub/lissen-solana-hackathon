import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { playlists } from "./playlists";

export const playlistsSongs = pgTable(
  "playlists_songs",
  {
    ...timestamps,
    songId: varchar("song_id", { length: 36 }).notNull(),
    playlistId: varchar("playlist_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      playlistsSongsId: primaryKey({
        columns: [table.songId, table.playlistId],
        name: "playlists_songs_id",
      }),
    };
  },
);

export const playlistsSongsRelations = relations(playlistsSongs, ({ one }) => ({
  playlist: one(playlists, {
    fields: [playlistsSongs.playlistId],
    references: [playlists.id],
  }),
}));
