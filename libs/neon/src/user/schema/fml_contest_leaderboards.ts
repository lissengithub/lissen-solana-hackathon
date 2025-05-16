import {
  pgTable,
  varchar,
  integer,
  primaryKey,
  jsonb,
} from "drizzle-orm/pg-core";
import { timestampWithTimezone } from "../../utils/fields";
import { relations, sql } from "drizzle-orm";
import { users } from "./users";
import { fmlContests } from "./fml_contests";

export const fmlContestLeaderboards = pgTable(
  "fml_contest_leaderboards",
  {
    contestId: varchar("contest_id", { length: 36 }).notNull(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    rank: integer("rank").notNull(),
    totalPoints: integer("total_points").notNull().default(0),
    date: timestampWithTimezone("date").notNull(),
    rosterHistory: jsonb("roster_history")
      .notNull()
      .default(sql`'{}'`)
      .$type<{ sc_artist_id: string; total_points: number }[]>(),
  },
  (table) => ({
    fmlContestLeaderboardsPk: primaryKey({
      columns: [table.contestId, table.date, table.userId],
    }),
  }),
);

export const fmlContestLeaderboardsRelations = relations(
  fmlContestLeaderboards,
  ({ one }) => ({
    user: one(users, {
      fields: [fmlContestLeaderboards.userId],
      references: [users.id],
    }),
    contest: one(fmlContests, {
      fields: [fmlContestLeaderboards.contestId],
      references: [fmlContests.id],
    }),
  }),
);
