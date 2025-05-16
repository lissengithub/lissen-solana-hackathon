import { relations } from "drizzle-orm";
import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { timestamps, timestampWithTimezone } from "../../utils/fields";
import { accesses } from "./accesses";

export const accessTypeConcert = pgTable("access_type_concert", {
  ...timestamps,
  accessId: varchar("access_id", { length: 36 }).primaryKey(),
  dateTime: timestampWithTimezone("date_time").notNull(),
  city: text("city").notNull(),
  venue: text("venue").notNull(),
  instructions: text("instructions"),
  instructionsImage: text("instructions_image"),
});

export const accessTypeConcertRelations = relations(
  accessTypeConcert,
  ({ one }) => ({
    access: one(accesses, {
      fields: [accessTypeConcert.accessId],
      references: [accesses.id],
    }),
  }),
);
