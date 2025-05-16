import { pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps, autoId } from "../../utils/fields";
import { relations } from "drizzle-orm";
import { fmlLeagues } from "./fml_leagues";

export const fmlLeagueTraits = pgTable("fml_league_traits", {
  ...timestamps,
  ...autoId,
  leagueId: varchar("league_id", { length: 36 }).notNull(),
  traitId: varchar("trait_id", { length: 36 }).notNull(),
});

export const fmlLeagueTraitsRelations = relations(
  fmlLeagueTraits,
  ({ one }) => ({
    league: one(fmlLeagues, {
      fields: [fmlLeagueTraits.leagueId],
      references: [fmlLeagues.id],
    }),
  }),
);
