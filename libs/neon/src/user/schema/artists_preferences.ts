import { boolean, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps, timestampWithTimezone } from "../../utils/fields";

export const artistsPreferences = pgTable("artists_preferences", {
  ...timestamps,
  artistId: varchar("artist_id", { length: 36 }).primaryKey(),
  extLink: text("ext_link"),
  isProcessed: boolean("is_processed").notNull().default(false),
  nextTalkDate: timestampWithTimezone("next_talk_date"),
});
