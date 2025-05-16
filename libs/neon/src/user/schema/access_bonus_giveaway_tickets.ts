import { relations } from "drizzle-orm";
import { pgTable, varchar, smallint, boolean } from "drizzle-orm/pg-core";
import { timestamps, autoId } from "../../utils/fields";
import { accesses } from "./accesses";
import { users } from "./users";
import { accessBonusGiveaways } from "./access_bonus_giveaways";

export const accessBonusGiveawayTickets = pgTable(
  "access_bonus_giveaway_tickets",
  {
    ...timestamps,
    ...autoId,
    accessId: varchar("access_id", { length: 36 }).notNull(),
    bonusGiveawayId: varchar("bonus_giveaway_id", { length: 36 }),
    userId: varchar("user_id", { length: 36 }).notNull(),
    amountCommited: smallint("amount_commited").notNull(),
    won: boolean("won").notNull().default(false),
  },
);

export const accessBonusGiveawayTicketsRelations = relations(
  accessBonusGiveawayTickets,
  ({ one }) => ({
    access: one(accesses, {
      fields: [accessBonusGiveawayTickets.accessId],
      references: [accesses.id],
    }),
    user: one(users, {
      fields: [accessBonusGiveawayTickets.userId],
      references: [users.id],
    }),
    bonusGiveaway: one(accessBonusGiveaways, {
      fields: [accessBonusGiveawayTickets.bonusGiveawayId],
      references: [accessBonusGiveaways.id],
    }),
  }),
);
