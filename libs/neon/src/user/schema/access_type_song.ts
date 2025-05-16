import { pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps, autoId } from "../../utils/fields";
import { relations } from "drizzle-orm";
import { accesses } from "./accesses";
import { accessTypeSongOwners } from "./access_type_song_owners";

export const accessTypeSong = pgTable("access_type_song", {
  ...timestamps,
  ...autoId,
  accessId: varchar("access_id", { length: 36 }).notNull(),
  songId: varchar("song_id", { length: 36 }).notNull(),
});

export const accessTypeSongRelations = relations(
  accessTypeSong,
  ({ one, many }) => ({
    accessTypeSongOwners: many(accessTypeSongOwners),
    access: one(accesses, {
      fields: [accessTypeSong.accessId],
      references: [accesses.id],
    }),
  }),
);
