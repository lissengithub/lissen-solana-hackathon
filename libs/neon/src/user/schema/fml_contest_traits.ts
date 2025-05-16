import { pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps, autoId } from "../../utils/fields";
import { fmlContests } from "./fml_contests";

export const fmlContestTraits = pgTable("fml_contest_traits", {
  ...autoId,
  contestId: text("contest_id").notNull(),
  traitId: text("trait_id").notNull(),
  ...timestamps,
});

export const fmlContestTraitsRelations = relations(
  fmlContestTraits,
  ({ one }) => ({
    contest: one(fmlContests, {
      fields: [fmlContestTraits.contestId],
      references: [fmlContests.id],
    }),
  }),
);
