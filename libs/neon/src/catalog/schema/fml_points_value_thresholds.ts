import { varchar, pgTable, integer, serial } from "drizzle-orm/pg-core";

export const fmlPointsValueThresholds = pgTable("fml_points_value_thresholds", {
  id: serial("id").primaryKey(),
  metric_type: varchar("metric_type")
    .$type<"instagram_followers" | "tiktok_followers">()
    .notNull(),
  min_value: integer("min_value").notNull(),
  max_value: integer("max_value"),
  value: integer("value").notNull(),
});
