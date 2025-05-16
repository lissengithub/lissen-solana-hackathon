import { relations, sql } from "drizzle-orm";
import { pgTable, varchar, text, index, boolean } from "drizzle-orm/pg-core";
import { timestamps, autoId } from "../../utils/fields";
import { users } from "./users";
import { playlistsSongs } from "./playlists_songs";

export const playlists = pgTable(
  "playlists",
  {
    ...timestamps,
    ...autoId,
    title: text("title").notNull(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    image: text("image"),
    blurhash: varchar("blurhash", { length: 200 }),
    visibility: varchar("visibility", {
      length: 20,
      enum: ["public", "private"],
    })
      .notNull()
      .default("private"),
    hasPrivateSong: boolean("has_private_song").notNull().default(false),
  },
  (table) => {
    return {
      titleSearchIndex: index("playlists_title_search_index").using(
        "gin",
        sql`to_tsvector('english', ${table.title})`,
      ),
    };
  },
);

export const playlistsRelations = relations(playlists, ({ one, many }) => ({
  user: one(users, {
    fields: [playlists.userId],
    references: [users.id],
  }),
  playlistSongs: many(playlistsSongs),
}));
