import { pgTable, jsonb, varchar, primaryKey } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { InferSelectModel } from "drizzle-orm";

export const artistTopSongsCache = pgTable(
  "artist_top_songs_cache",
  {
    ...timestamps,
    resources: jsonb("resources")
      .$type<{ id: string; type: "song" }[]>()
      .notNull(),
    artistId: varchar("artist_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      artistTopSongsCacheId: primaryKey({
        columns: [table.artistId],
        name: "artist_top_songs_cache_id",
      }),
    };
  },
);

export type ArtistTopSongsCache = InferSelectModel<typeof artistTopSongsCache>;
