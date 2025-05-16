import { ZOOM_EVENT_TYPES } from "@libs/utils";
import { relations } from "drizzle-orm";
import { bigint, jsonb, pgTable, varchar } from "drizzle-orm/pg-core";
import { autoId, timestamps } from "../../utils/fields";
import { videocalls } from "./videocalls";

export const videocallEvents = pgTable("videocall_events", {
  ...timestamps,
  ...autoId,
  eventPayload: jsonb("event_payload").notNull(),
  eventTimestamp: bigint("event_timestamp", { mode: "number" }).notNull(),
  eventType: varchar("event_type", {
    length: 50,
    enum: ZOOM_EVENT_TYPES,
  }).notNull(),
  videocallId: varchar("videocall_id", { length: 36 }).notNull(),
});

export const videocallEventsRelations = relations(
  videocallEvents,
  ({ one }) => ({
    videocall: one(videocalls, {
      fields: [videocallEvents.videocallId],
      references: [videocalls.id],
    }),
  }),
);
