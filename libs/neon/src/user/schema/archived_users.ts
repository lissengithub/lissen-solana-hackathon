import { pgTable, jsonb } from "drizzle-orm/pg-core";
import { autoId, timestamps } from "../../utils/fields";

export const archivedUsers = pgTable("archived_users", {
  ...timestamps,
  ...autoId,
  data: jsonb("data").notNull(),
});
