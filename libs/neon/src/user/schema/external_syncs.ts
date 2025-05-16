import { relations } from "drizzle-orm";
import { jsonb, pgTable, varchar } from "drizzle-orm/pg-core";
import { autoId, timestamps } from "../../utils/fields";
import { users } from "./users";

export const externalSyncs = pgTable("external_user_preferences", {
  ...timestamps,
  ...autoId,
  userId: varchar("user_id", { length: 36 }).notNull(),
  platform: varchar("platform", {
    length: 36,
    enum: ["spotify", "manual_entry", "youtube", "appleMusic"],
  }).notNull(),
  data: jsonb("data").$type<
    | {
        type: "playlists";
        playlists: ({
          id?: string;
          name?: string;
          songs?: ({
            isrc?: string;
          } & Record<string, unknown>)[];
        } & Record<string, unknown>)[];
      }
    | {
        type: "genres";
        genres: {
          id: string;
        }[];
      }
  >(),
});

export const externalSyncsRelations = relations(externalSyncs, ({ one }) => ({
  user: one(users, {
    fields: [externalSyncs.userId],
    references: [users.id],
  }),
}));
