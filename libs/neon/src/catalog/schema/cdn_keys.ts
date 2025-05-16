import { pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps, autoId, timestampWithTimezone } from "../../utils/fields";

export const cdn_keys = pgTable("cdn_keys", {
  ...timestamps,
  ...autoId,
  expiry: timestampWithTimezone("expiry").notNull(),
  bunnyCDNPath: varchar("bunny_cdn_path", { length: 200 }),
});
