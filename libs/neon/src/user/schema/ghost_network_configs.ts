import { integer, pgTable, text, jsonb, numeric } from "drizzle-orm/pg-core";
import { autoId, timestamps } from "../../utils/fields";

export const ghostNetworkConfigs = pgTable("ghost_network_configs", {
  ...autoId,
  ...timestamps,
  title: text("title").notNull(),
  dailyBudget: integer("daily_budget").notNull(),
  actualDailySpend: numeric("actual_daily_spend", {
    precision: 10,
    scale: 2,
  })
    .$type<number>()
    .notNull(),
  numberOfGhostUsers: integer("number_of_ghost_users").notNull(),
  minPlaysPerSong: integer("min_plays_per_song").notNull(),
  maxPlaysPerSong: integer("max_plays_per_song").notNull(),
  songs: jsonb("songs")
    .$type<
      Array<{
        id: string;
        title: string;
        artistNames: string[];
        cashAmount: number;
        numberOfUsers: number;
      }>
    >()
    .default([]),
  users: jsonb("users")
    .$type<
      Array<{
        id: string;
      }>
    >()
    .default([]),
});
