import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar, smallint } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { users } from "./users";

export const managers = pgTable(
  "managers",
  {
    ...timestamps,
    userId: varchar("user_id", { length: 28 }).notNull(),
    entityId: varchar("entity_id", { length: 36 }).notNull(),
    entityType: varchar("entity_type", {
      length: 20,
      enum: ["artist", "composition", "recording"],
    }).notNull(),
    accessLevel: smallint("access_level").notNull(),
  },
  (table) => {
    return {
      managersUserEntityId: primaryKey({
        columns: [table.userId, table.entityId],
        name: "managers_user_entity_id",
      }),
    };
  },
);

export const managersRelations = relations(managers, ({ one }) => ({
  user: one(users, {
    fields: [managers.userId],
    references: [users.id],
  }),
}));
