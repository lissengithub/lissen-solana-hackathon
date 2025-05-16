import { relations, sql } from "drizzle-orm";
import { pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { timestampWithTimezone } from "../../utils/fields";
import { users } from "./users";

export const usersStreak = pgTable("users_streak", {
  timestamp: timestampWithTimezone("timestamp")
    .notNull()
    .default(sql`now()`),
  userId: varchar("user_id", { length: 28 }).primaryKey(),
  streak: integer("streak").notNull(),
});

export const usersStreakRelations = relations(usersStreak, ({ one }) => ({
  user: one(users, {
    fields: [usersStreak.userId],
    references: [users.id],
  }),
}));
