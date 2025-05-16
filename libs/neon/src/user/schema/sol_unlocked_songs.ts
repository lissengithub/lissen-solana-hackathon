import { pgTable, varchar } from "drizzle-orm/pg-core";

export const solUnlockedSongs = pgTable("sol_unlocked_songs", {
  userId: varchar("user_id").notNull(),
  songId: varchar("song_id").notNull(),
});
