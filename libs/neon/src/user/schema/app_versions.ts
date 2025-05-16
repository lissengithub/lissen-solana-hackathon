import { pgTable, varchar, text, boolean } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";

export const appVersions = pgTable("app_versions", {
  ...timestamps,
  version: text("version").notNull().primaryKey(),
  updateMessages: varchar("update_messages", { length: 500 }).notNull(), // Play store update message limit
  forceUpdate: boolean("force_update").notNull().default(false),
});
