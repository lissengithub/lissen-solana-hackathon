import { pgTable, varchar, integer, text } from "drizzle-orm/pg-core";
import { timestamps, autoId } from "../../utils/fields";
import { relations } from "drizzle-orm";
import { fmlContests } from "./fml_contests";

export const fmlContestPrizes = pgTable("fml_contest_prizes", {
  ...timestamps,
  ...autoId,
  contestId: varchar("contest_id", { length: 36 }).notNull(),
  rankStart: integer("rank_start").notNull(),
  rankEnd: integer("rank_end").notNull(),
  prizeDescription: text("prize_description").notNull(),
  prizeType: varchar("prize_type", { length: 50 }).notNull(), // 'gems', 'merch', 'access'
  prizeValue: integer("prize_value").notNull().default(0),
});

export const fmlContestPrizesRelations = relations(
  fmlContestPrizes,
  ({ one }) => ({
    contest: one(fmlContests, {
      fields: [fmlContestPrizes.contestId],
      references: [fmlContests.id],
    }),
  }),
);
