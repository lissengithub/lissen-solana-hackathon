import { pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps, autoId } from "../../utils/fields";
import { fmlLeagueTraits } from "./fml_league_traits";
import { relations } from "drizzle-orm";
import { fmlContests } from "./fml_contests";
import { fmlRosters } from "./fml_rosters";

export const fmlLeagues = pgTable("fml_leagues", {
  ...timestamps,
  ...autoId,
  displayName: varchar("display_name", { length: 100 }).notNull(),
  image: varchar("image", { length: 255 }),
  color: varchar("color", { length: 25 }),
});

export const fmlLeaguesRelations = relations(fmlLeagues, ({ many }) => ({
  traits: many(fmlLeagueTraits),
  contests: many(fmlContests),
  rosters: many(fmlRosters),
}));
