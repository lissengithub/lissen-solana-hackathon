import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { users } from "./users";

export const userLibraryArtists = pgTable(
  "user_library_artists",
  {
    ...timestamps,
    userId: varchar("user_id", { length: 36 }).notNull(),
    artistId: varchar("artist_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      userArtistId: primaryKey({
        columns: [table.userId, table.artistId],
        name: "user_library_artists_id",
      }),
    };
  },
);

export const userLibraryArtistsRelations = relations(
  userLibraryArtists,
  ({ one }) => ({
    user: one(users, {
      fields: [userLibraryArtists.userId],
      references: [users.id],
    }),
  }),
);
