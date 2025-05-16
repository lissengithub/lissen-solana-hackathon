import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { users } from "./users";

export const userLibraryPlaylists = pgTable(
  "user_library_playlists",
  {
    ...timestamps,
    userId: varchar("user_id", { length: 36 }).notNull(),
    playlistId: varchar("playlist_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      userPlaylistId: primaryKey({
        columns: [table.userId, table.playlistId],
        name: "user_library_playlists_id",
      }),
    };
  },
);

export const userLibraryPlaylistsRelations = relations(
  userLibraryPlaylists,
  ({ one }) => ({
    user: one(users, {
      fields: [userLibraryPlaylists.userId],
      references: [users.id],
    }),
  }),
);
