import { varchar, pgTable, index } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { fmlTraits } from "./fml_traits";
import { relations } from "drizzle-orm";
import { fmlArtists } from "./fml_artists";

export const fmlArtistTraits = pgTable(
  "fml_artist_traits",
  {
    ...timestamps,
    id: varchar("id").primaryKey(),
    scArtistId: varchar("sc_artist_id").notNull(),
    traitId: varchar("trait_id").notNull(),
  },
  (table) => ({
    fmlArtistTraitsScArtistIdIdx: index(
      "fml_artist_traits_sc_artist_id_idx",
    ).on(table.scArtistId),
    fmlArtistTraitsTraitIdIdx: index("fml_artist_traits_trait_id_idx").on(
      table.traitId,
    ),
  }),
);

export type FmlArtistTraits = typeof fmlArtistTraits.$inferSelect;

export const fmlArtistTraitsRelations = relations(
  fmlArtistTraits,
  ({ one }) => ({
    trait: one(fmlTraits, {
      fields: [fmlArtistTraits.traitId],
      references: [fmlTraits.id],
    }),
    artist: one(fmlArtists, {
      fields: [fmlArtistTraits.scArtistId],
      references: [fmlArtists.scArtistId],
    }),
  }),
);
