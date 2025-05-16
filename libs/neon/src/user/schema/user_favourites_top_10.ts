import { relations } from "drizzle-orm";
import { decimal, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { timestampWithTimezone } from "../../utils/fields";
import { users } from "./users";

export const userFavouritesTop10 = pgTable(
  "user_favourites_top_10",
  {
    updatedAt: timestampWithTimezone("updated_at").notNull(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    collectionId: varchar("collection_id", { length: 36 }).notNull(),
    collectionType: varchar("collection_type", {
      length: 20,
      enum: ["album", "playlist", "artist"],
    }).notNull(),
    totalScore: decimal("total_score").notNull(),
  },
  (table) => {
    return {
      userFavouritesTop10Id: primaryKey({
        columns: [table.userId, table.collectionId],
        name: "user_favourites_top_10_id",
      }),
    };
  },
);

export const userFavouritesTop10Relations = relations(
  userFavouritesTop10,
  ({ one }) => ({
    user: one(users, {
      fields: [userFavouritesTop10.userId],
      references: [users.id],
    }),
  }),
);
