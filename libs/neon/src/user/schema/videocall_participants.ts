import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { users } from "./users";
import { videocalls } from "./videocalls";

export const videocallParticipants = pgTable(
  "videocall_participants",
  {
    ...timestamps,
    videocallId: varchar("videocall_id", { length: 36 }).notNull(),
    userId: varchar("user_id", { length: 28 }).notNull(),
  },
  (table) => {
    return {
      videocallParticipantsUserVideocallId: primaryKey({
        columns: [table.userId, table.videocallId],
        name: "videocall_participants_user_videocall_id",
      }),
    };
  },
);

export const videocallParticipantsRelations = relations(
  videocallParticipants,
  ({ one }) => ({
    videocall: one(videocalls, {
      fields: [videocallParticipants.videocallId],
      references: [videocalls.id],
    }),
    user: one(users, {
      fields: [videocallParticipants.userId],
      references: [users.id],
    }),
  }),
);
