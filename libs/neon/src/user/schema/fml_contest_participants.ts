import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { timestamps, autoId, timestampWithTimezone } from "../../utils/fields";
import { fmlContests } from "./fml_contests";
import { users } from "./users";

export const fmlContestParticipants = pgTable("fml_contest_participants", {
  ...autoId,
  contestId: text("contest_id").notNull(),
  userId: text("user_id").notNull(),
  joinedAt: timestampWithTimezone("joined_at")
    .notNull()
    .default(sql`now()`),
  scArtistIds: varchar("sc_artist_ids", { length: 36 })
    .array()
    .notNull()
    .default(sql`'{}'`),
  ...timestamps,
});

export const fmlContestParticipantsRelations = relations(
  fmlContestParticipants,
  ({ one }) => ({
    contest: one(fmlContests, {
      fields: [fmlContestParticipants.contestId],
      references: [fmlContests.id],
    }),
    user: one(users, {
      fields: [fmlContestParticipants.userId],
      references: [users.id],
    }),
  }),
);
