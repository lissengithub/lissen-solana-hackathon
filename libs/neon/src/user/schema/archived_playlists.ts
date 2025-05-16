import { pgTable, jsonb, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";

export const archivedPlaylists = pgTable("archived_playlists", {
  ...timestamps,
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  data: jsonb("data").notNull(),
});
