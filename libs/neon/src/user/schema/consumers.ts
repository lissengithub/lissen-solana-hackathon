import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps, autoId } from "../../utils/fields";
import { consumerWallets } from "./consumer_wallets";
import { paymentProfiles } from "./payment_profiles";

export const consumers = pgTable("consumers", {
  ...timestamps,
  ...autoId,
  subscription: varchar("subscription", {
    length: 20,
    enum: ["free", "premium", "premium-trial"],
  }).notNull(),
  walletId: varchar("wallet_id", { length: 36 }),
});

export const consumersRelations = relations(consumers, ({ one }) => ({
  wallet: one(consumerWallets, {
    fields: [consumers.walletId],
    references: [consumerWallets.id],
  }),
  paymentProfile: one(paymentProfiles, {
    fields: [consumers.id],
    references: [paymentProfiles.consumerId],
  }),
}));
