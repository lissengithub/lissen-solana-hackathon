import { pgTable, primaryKey, varchar, text } from "drizzle-orm/pg-core";
import { timestamps, timestampWithTimezone } from "../../utils/fields";

export const inboxes = pgTable(
  "inboxes",
  {
    ...timestamps,
    userId: varchar("user_id", { length: 28 }).notNull(),
    read: timestampWithTimezone("read"),
    title: text("title").notNull(),
    type: varchar("type", {
      length: 30,
      enum: ["music", "access"],
    }).notNull(),
    resourceType: varchar("resource_type", {
      length: 30,
      enum: ["album", "collaboration", "ticket", "bonus_giveaway"],
    }).notNull(),
    resourceId: varchar("resource_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      userInboxesId: primaryKey({
        columns: [table.userId, table.resourceId],
        name: "user_inboxes_id",
      }),
    };
  },
);
