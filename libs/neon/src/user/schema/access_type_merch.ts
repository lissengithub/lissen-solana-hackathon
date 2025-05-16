import { relations } from "drizzle-orm";
import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { accesses } from "./accesses";

export const accessTypeMerch = pgTable("access_type_merch", {
  ...timestamps,
  accessId: varchar("access_id", { length: 36 }).primaryKey(),
  item: text("item").notNull(),
  instructions: text("instructions"),
});

export const accessTypeMerchRelations = relations(
  accessTypeMerch,
  ({ one }) => ({
    access: one(accesses, {
      fields: [accessTypeMerch.accessId],
      references: [accesses.id],
    }),
  }),
);
