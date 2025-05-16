import { pgTable, integer, varchar, primaryKey } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";

// Table to store likes on feed items
export const fmlFeedLikes = pgTable(
  "fml_feed_likes",
  {
    ...timestamps,
    userId: varchar("user_id").notNull(),
    logId: integer("log_id").notNull(),
  },
  (table) => {
    return {
      fmlFeedLikesId: primaryKey({
        columns: [table.userId, table.logId],
        name: "fml_feed_likes_id",
      }),
    };
  },
);
