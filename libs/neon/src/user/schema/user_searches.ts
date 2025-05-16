import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { users } from "./users";

export const userSearches = pgTable(
  "user_searches",
  {
    ...timestamps,
    userId: varchar("user_id", { length: 28 }).notNull(),
    type: varchar("type", {
      length: 20,
      enum: ["album", "artist", "playlist", "song"],
    }).notNull(),
    resourceId: varchar("resource_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      userSearchesId: primaryKey({
        columns: [table.userId, table.type, table.resourceId],
        name: "user_searches_id",
      }),
    };
  },
);

export const userSearchesRelations = relations(userSearches, ({ one }) => ({
  user: one(users, {
    fields: [userSearches.userId],
    references: [users.id],
  }),
}));
