import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { timestamps, autoId, timestampWithTimezone } from "../../utils/fields";
import { relations } from "drizzle-orm";
import { fmlRosters, fmlContestLeaderboards, fmlContestPrizes } from "./index";
import { fmlContestTraits } from "./fml_contest_traits";
import { fmlContestParticipants } from "./fml_contest_participants";
import { fmlLeagues } from "./fml_leagues";

export const fmlContests = pgTable("fml_contests", {
  ...timestamps,
  ...autoId,
  name: varchar("name", { length: 100 }).notNull(),
  about: text("about"),
  howItWorks: text("how_it_works"),
  image: varchar("image", { length: 255 }),
  startDate: timestampWithTimezone("start_date").notNull(),
  endDate: timestampWithTimezone("end_date").notNull(),
  leagueId: varchar("league_id", { length: 36 }).notNull().default(""),
});

export const fmlContestsRelations = relations(fmlContests, ({ many, one }) => ({
  league: one(fmlLeagues, {
    fields: [fmlContests.leagueId],
    references: [fmlLeagues.id],
  }),
  rosters: many(fmlRosters),
  leaderboards: many(fmlContestLeaderboards),
  prizes: many(fmlContestPrizes),
  traits: many(fmlContestTraits),
  participants: many(fmlContestParticipants),
}));
