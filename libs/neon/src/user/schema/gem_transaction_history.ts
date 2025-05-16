import { index, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { autoId, timestamps } from "../../utils/fields";

export const gemTransactionHistory = pgTable(
  "gem_transaction_history",
  {
    ...autoId,
    ...timestamps,
    action: text("action", {
      enum: [
        "follow_artist",
        "join_artist",
        "flip_exclusives",
        "buy_ticket",
        "refund_ticket",
        "full_song_stream",
        "signup",
        "buy_bonus_giveaway",
        "buy_bonus_direct",
        "fml_add_artist_to_roster",
        "fml_like_feed_item",
      ],
    }).notNull(),
    amount: integer("amount").notNull(),
    artistId: varchar("artist_id", { length: 36 }),
    accessId: varchar("access_id", { length: 36 }),
    userId: varchar("user_id", { length: 28 }).notNull(),
    accessUserVoucherId: varchar("access_user_voucher_id", { length: 36 }),
    songId: varchar("song_id", { length: 36 }),
    bonusGiveawayId: varchar("bonus_giveaway_id", { length: 36 }),
    bonusDirectId: varchar("bonus_direct_id", { length: 36 }),
  },
  (table) => ({
    gemTransactionHistoryArtistIdx: index(
      "gem_transaction_history_artist_idx",
    ).on(table.action, table.artistId, table.userId),
    gemTransactionHistoryAccessIdx: index(
      "gem_transaction_history_access_idx",
    ).on(table.action, table.accessId, table.userId),
    gemTransactionHistoryAccessUserVoucherIdx: index(
      "gem_transaction_history_access_user_voucher_idx",
    ).on(table.action, table.userId, table.accessUserVoucherId),
    gemTransactionHistorySongIdx: index("gem_transaction_history_song_idx").on(
      table.action,
      table.userId,
      table.songId,
    ),
    gemTransactionHistoryBonusGiveawayIdx: index(
      "gem_transaction_history_bonus_giveaway_idx",
    ).on(table.action, table.userId, table.bonusGiveawayId),
    gemTransactionHistoryBonusDirectIdx: index(
      "gem_transaction_history_bonus_direct_idx",
    ).on(table.action, table.userId, table.bonusDirectId),
  }),
);

export type GemTransactionHistory = typeof gemTransactionHistory.$inferSelect;
