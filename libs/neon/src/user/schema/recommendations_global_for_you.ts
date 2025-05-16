import { pgTable, varchar } from "drizzle-orm/pg-core";

export const recommendationsGlobalForYou = pgTable(
  "recommendations_global_for_you",
  {
    recommendationId: varchar("recommendation_id", { length: 73 }).notNull(),
    resourceId: varchar("resource_id", { length: 36 }).primaryKey().notNull(),
    resourceType: varchar("resource_type", {
      enum: ["album", "playlist"],
    }).notNull(),
  },
);
