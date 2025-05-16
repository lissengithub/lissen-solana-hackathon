import { pgTable, integer, varchar, primaryKey } from "drizzle-orm/pg-core";

export const recommendationsGlobalGenreAlbum = pgTable(
  "recommendations_global_genre_album",
  {
    albumId: varchar("album_id", { length: 36 }).notNull(),
    albumRank: integer("album_rank").notNull(),
    genreId: varchar("genre_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      recommendationsGlobalGenreAlbumId: primaryKey({
        columns: [table.genreId, table.albumId],
        name: "recommendations_global_genre_album_id",
      }),
    };
  },
);
