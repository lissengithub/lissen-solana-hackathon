import { relations } from "drizzle-orm";
import { pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { users } from "./users";

export const usersGems = pgTable("users_gems", {
  ...timestamps,
  userId: varchar("user_id", { length: 28 }).primaryKey(),
  gems: integer("gems").notNull(),
});

export const usersGemsRelations = relations(usersGems, ({ one }) => ({
  user: one(users, {
    fields: [usersGems.userId],
    references: [users.id],
  }),
}));
