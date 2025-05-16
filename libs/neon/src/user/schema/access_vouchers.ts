import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { autoId, timestamps, timestampWithTimezone } from "../../utils/fields";
import { accesses } from "./accesses";
import { accessUsersVouchers } from "./access_users_vouchers";

export const accessVouchers = pgTable(
  "access_vouchers",
  {
    ...autoId,
    ...timestamps,
    accessId: varchar("access_id", { length: 36 }).notNull(),
    gemCost: integer("gem_cost").notNull(),
    discountValue: decimal("discount_value").notNull(),
    visibility: text("visibility", {
      enum: ["public", "private"],
    }).notNull(),
    rewardType: text("reward_type", {
      enum: ["access"],
    }).notNull(),
    premiumUsersOnly: boolean("premium_users_only").notNull().default(false),
    minimumLevelRequired: integer("minimum_level_required")
      .notNull()
      .default(0),
    expiresAt: timestampWithTimezone("expires_at"),
  },
  (table) => ({
    accessIdIdx: index("access_vouchers_access_id_idx").on(table.accessId),
  }),
);

export const accessVouchersRelations = relations(
  accessVouchers,
  ({ one, many }) => ({
    access: one(accesses, {
      fields: [accessVouchers.accessId],
      references: [accesses.id],
    }),
    accessUsersVouchers: many(accessUsersVouchers),
  }),
);

export type AccessVoucher = typeof accessVouchers.$inferSelect;
