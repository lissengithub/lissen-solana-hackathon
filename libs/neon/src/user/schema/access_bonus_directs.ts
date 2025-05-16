import { relations } from "drizzle-orm";
import { pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { autoId, timestamps, timestampWithTimezone } from "../../utils/fields";
import { accesses } from "./accesses";

export const accessBonusDirects = pgTable("access_bonus_directs", {
  ...autoId,
  ...timestamps,
  accessId: varchar("access_id", { length: 36 }).notNull(),
  gemCost: integer("gem_cost").notNull(),
  startDate: timestampWithTimezone("start_date").notNull(),
  rewardCountPerWinner: integer("reward_count_per_winner").notNull(),
  numberOfWinners: integer("number_of_winners").notNull(),
});

export const accessBonusDirectsRelations = relations(
  accessBonusDirects,
  ({ one }) => ({
    access: one(accesses, {
      fields: [accessBonusDirects.accessId],
      references: [accesses.id],
    }),
  }),
);
