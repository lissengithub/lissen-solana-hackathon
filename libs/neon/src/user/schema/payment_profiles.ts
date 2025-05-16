import { relations } from "drizzle-orm";
import { pgTable, varchar, decimal } from "drizzle-orm/pg-core";
import { timestamps, autoId, timestampWithTimezone } from "../../utils/fields";
import { consumers } from "./consumers";

export const paymentProfiles = pgTable("payment_profiles", {
  ...timestamps,
  ...autoId,
  status: varchar("status", { length: 20 }).notNull(),
  amountPaid: decimal("amount_paid"),
  amountReceived: decimal("amount_received"),
  amountNet: decimal("amount_net"),
  currency: varchar("currency", { length: 3 }),
  provider: varchar("provider", { length: 20 }).notNull(),
  startDate: timestampWithTimezone("start_date").notNull(),
  endDate: timestampWithTimezone("end_date"),
  taxPercentage: decimal("tax_percentage"),
  consumerId: varchar("consumer_id", { length: 36 }),
});

export const paymentProfilesRelations = relations(
  paymentProfiles,
  ({ one }) => ({
    consumer: one(consumers, {
      fields: [paymentProfiles.consumerId],
      references: [consumers.id],
    }),
  }),
);
