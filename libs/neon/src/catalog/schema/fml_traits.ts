import { varchar, pgTable } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";

export const fmlTraits = pgTable("fml_traits", {
  ...timestamps,
  id: varchar("id").primaryKey(),
  type: varchar("type").notNull(),
  value: varchar("value").notNull(),
});

export type FmlTraits = typeof fmlTraits.$inferSelect;
