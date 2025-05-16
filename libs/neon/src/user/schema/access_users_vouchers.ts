import { relations } from "drizzle-orm";
import { boolean, index, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { autoId, timestamps } from "../../utils/fields";
import { users } from "./users";
import { accessVouchers } from "./access_vouchers";

export const accessUsersVouchers = pgTable(
  "access_users_vouchers",
  {
    ...timestamps,
    ...autoId,
    accessVoucherId: varchar("access_voucher_id", { length: 36 }).notNull(),
    userId: varchar("user_id", { length: 28 }).notNull(),
    used: boolean("used").notNull(),
    redeemCode: text("redeem_code"),
  },
  (table) => ({
    accessVoucherIdIdx: index("access_users_vouchers_access_voucher_id_idx").on(
      table.accessVoucherId,
    ),
    userIdIdx: index("access_users_vouchers_user_id_idx").on(table.userId),
  }),
);

export const accessUsersVouchersRelations = relations(
  accessUsersVouchers,
  ({ one }) => ({
    accessVoucher: one(accessVouchers, {
      fields: [accessUsersVouchers.accessVoucherId],
      references: [accessVouchers.id],
    }),
    user: one(users, {
      fields: [accessUsersVouchers.userId],
      references: [users.id],
    }),
  }),
);
