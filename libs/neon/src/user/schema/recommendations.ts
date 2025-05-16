import { pgTable, primaryKey, varchar, jsonb } from "drizzle-orm/pg-core";
import { timestamps, timestampWithTimezone } from "../../utils/fields";

export const recommendations = pgTable(
  "recommendations",
  {
    ...timestamps,
    date: timestampWithTimezone("date").notNull(),
    type: varchar("type", {
      enum: [
        "for-you",
        "discover-daily",
        "artists",
        "playlists",
        "todays-top-hits",
      ],
    }).notNull(),
    resources: jsonb("resources")
      .$type<{ id: string; type: "song" | "album" | "artist" | "playlist" }[]>()
      .notNull(),
    recommId: varchar("recomm_id").notNull(),
    userId: varchar("user_id", { length: 36 }).notNull(),
  },
  (table) => {
    return {
      recommendationsId: primaryKey({
        columns: [table.userId, table.type, table.date],
        name: "recommendations_id",
      }),
    };
  },
);
