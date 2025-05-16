import { relations } from "drizzle-orm";
import { pgTable, varchar, boolean, decimal } from "drizzle-orm/pg-core";
import { autoId, timestamps } from "../../utils/fields";
import { accesses } from "./accesses";
import { users } from "./users";

export const accessTickets = pgTable("access_tickets", {
  ...autoId,
  ...timestamps,
  accessId: varchar("access_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  defaultPrice: decimal("default_price").notNull(),
  purchasePrice: decimal("purchase_price").notNull(),
  claimed: boolean("claimed").default(false),
  redeemCode: varchar("redeem_code", { length: 100 }).notNull(),
});

export const accessTicketsRelations = relations(accessTickets, ({ one }) => ({
  user: one(users, {
    fields: [accessTickets.userId],
    references: [users.id],
  }),
  access: one(accesses, {
    fields: [accessTickets.accessId],
    references: [accesses.id],
  }),
}));
