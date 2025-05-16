import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { users } from "./users";

export const userLibraryAlbums = pgTable(
  "user_library_albums",
  {
    ...timestamps,
    userId: varchar("user_id", { length: 36 }).notNull(),
    albumId: varchar("album_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      userAlbumId: primaryKey({
        columns: [table.userId, table.albumId],
        name: "user_library_albums_id",
      }),
    };
  },
);

export const userLibraryAlbumsRelations = relations(
  userLibraryAlbums,
  ({ one }) => ({
    user: one(users, {
      fields: [userLibraryAlbums.userId],
      references: [users.id],
    }),
  }),
);
