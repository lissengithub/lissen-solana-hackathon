import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";

export const followers = pgTable(
  "followers",
  {
    ...timestamps,
    userId: varchar("user_id", { length: 28 }).notNull(),
    artistId: varchar("artist_id", { length: 36 }).notNull(),
    type: varchar("type", {
      length: 20,
      enum: ["follow", "subscribe"],
    }).notNull(),
  },
  (table) => {
    return {
      followersId: primaryKey({
        columns: [table.userId, table.artistId],
        name: "followers_id",
      }),
    };
  },
);
