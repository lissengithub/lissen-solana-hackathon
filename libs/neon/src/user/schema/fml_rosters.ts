import { pgTable, varchar, integer, primaryKey } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { fmlArtistMetrics } from "./fml_artist_metrics";
import { fmlLeagues } from "./fml_leagues";

export const fmlRosters = pgTable(
  "fml_rosters",
  {
    ...timestamps,
    userId: varchar("user_id", { length: 36 }).notNull(),
    scArtistId: varchar("sc_artist_id", { length: 36 }).notNull(),
    position: integer("position").notNull(),
    leagueId: varchar("league_id", { length: 36 }).notNull().default(""),
  },
  (table) => ({
    fmlRostersPk: primaryKey({
      columns: [table.userId, table.scArtistId, table.leagueId],
    }),
  }),
);

export const fmlRostersRelations = relations(fmlRosters, ({ one }) => ({
  user: one(users, {
    fields: [fmlRosters.userId],
    references: [users.id],
  }),
  artistMetrics: one(fmlArtistMetrics, {
    fields: [fmlRosters.scArtistId],
    references: [fmlArtistMetrics.scArtistId],
  }),
  league: one(fmlLeagues, {
    fields: [fmlRosters.leagueId],
    references: [fmlLeagues.id],
  }),
}));
