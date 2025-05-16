import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const solUserWallets = pgTable("sol_user_wallets", {
  userId: varchar("user_id", { length: 36 }).notNull(),
  publicKey: varchar("public_key").notNull(),
  secretKey: varchar("secret_key").notNull(),
});

export const solUserWalletsRelations = relations(solUserWallets, ({ one }) => ({
  user: one(users, {
    fields: [solUserWallets.userId],
    references: [users.id],
  }),
}));
