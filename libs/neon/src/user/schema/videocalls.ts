import { relations } from "drizzle-orm";
import { pgTable, smallint, varchar } from "drizzle-orm/pg-core";
import { autoId, timestamps, timestampWithTimezone } from "../../utils/fields";
import { accesses } from "./accesses";

export const videocalls = pgTable("videocall", {
  ...timestamps,
  ...autoId,
  accessId: varchar("access_id", { length: 36 }).notNull(),
  startTime: timestampWithTimezone("start_time").notNull(),
  artistJoinTime: timestampWithTimezone("artist_join_time"),
  duration: smallint("duration").notNull(),
});

export const videocallsRelations = relations(videocalls, ({ one }) => ({
  access: one(accesses, {
    fields: [videocalls.accessId],
    references: [accesses.id],
  }),
}));
