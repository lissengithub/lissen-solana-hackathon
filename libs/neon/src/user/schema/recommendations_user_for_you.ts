import { integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

export const recommendationsUserForYou = pgTable(
  "recommendations_user_for_you",
  {
    rank: integer("rank").notNull(),
    recommendationId: varchar("recommendation_id", { length: 73 }).notNull(),
    resourceId: varchar("resource_id", { length: 36 }).notNull(),
    resourceType: varchar("resource_type", {
      enum: ["album", "playlist"],
    }).notNull(),
    userId: varchar("user_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      recommendationsUserForYouId: primaryKey({
        columns: [table.userId, table.resourceId],
        name: "recommendations_user_for_you_id",
      }),
    };
  },
);
