import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { relations } from "drizzle-orm";
import { accessTypeSong } from "./access_type_song";

export const accessTypeSongOwners = pgTable(
  "access_type_song_owners",
  {
    ...timestamps,
    accessTypeSongId: varchar("access_type_song_id", {
      length: 36,
    }).notNull(),
    userId: varchar("user_id", { length: 28 }).notNull(),
  },
  (table) => {
    return {
      accessTypeSongOwnersId: primaryKey({
        columns: [table.accessTypeSongId, table.userId],
        name: "access_type_song_owners_id",
      }),
    };
  },
);

export const accessTypeSongOwnersRelations = relations(
  accessTypeSongOwners,
  ({ one }) => ({
    accessTypeSong: one(accessTypeSong, {
      fields: [accessTypeSongOwners.accessTypeSongId],
      references: [accessTypeSong.id],
    }),
  }),
);
