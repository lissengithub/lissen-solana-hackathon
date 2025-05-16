import { pgTable, varchar, index } from "drizzle-orm/pg-core";

export const fmlArtistMapping = pgTable(
  "fml_artist_mapping",
  {
    scArtistId: varchar("sc_artist_id", { length: 36 }),
    lissenArtistId: varchar("lissen_artist_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      lissenArtistIdIdx: index("fml_artist_mapping_lissen_artist_id_idx").on(
        table.lissenArtistId,
      ),
      scArtistIdIdx: index("fml_artist_mapping_sc_artist_id_idx").on(
        table.scArtistId,
      ),
    };
  },
);
