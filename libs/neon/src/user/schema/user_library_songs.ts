import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { users } from "./users";

export const userLibrarySongs = pgTable(
  "user_library_songs",
  {
    ...timestamps,
    userId: varchar("user_id", { length: 36 }).notNull(),
    songId: varchar("song_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      userSongId: primaryKey({
        columns: [table.userId, table.songId],
        name: "user_library_songs_id",
      }),
    };
  },
);

export const userLibrarySongsRelations = relations(
  userLibrarySongs,
  ({ one }) => ({
    user: one(users, {
      fields: [userLibrarySongs.userId],
      references: [users.id],
    }),
  }),
);
