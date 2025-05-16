import { relations } from "drizzle-orm";
import { pgTable, varchar, boolean, integer } from "drizzle-orm/pg-core";
import { autoId, timestamps, timestampWithTimezone } from "../../utils/fields";
import { accesses } from "./accesses";
import { accessBonusGiveawayTickets } from "./access_bonus_giveaway_tickets";

export const accessBonusGiveaways = pgTable("access_bonus_giveaways", {
  ...autoId,
  ...timestamps,
  accessId: varchar("access_id", { length: 36 }).notNull(),
  gemCost: integer("gem_cost").notNull(),
  startDate: timestampWithTimezone("start_date").notNull(),
  rewardCountPerWinner: integer("reward_count_per_winner").notNull(),
  numberOfWinners: integer("number_of_winners").notNull(),
  raffleDate: timestampWithTimezone("raffle_date").notNull(),
  raffleHasDrawn: boolean("raffle_has_drawn").notNull().default(false),
});

export const accessBonusGiveawaysRelations = relations(
  accessBonusGiveaways,
  ({ one, many }) => ({
    access: one(accesses, {
      fields: [accessBonusGiveaways.accessId],
      references: [accesses.id],
    }),
    accessBonusGiveawayTickets: many(accessBonusGiveawayTickets),
  }),
);
