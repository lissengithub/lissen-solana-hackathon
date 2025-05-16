import {
  index,
  integer,
  pgTable,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestampWithTimezone } from "../../utils/fields";
import { users } from "./users";

export const usersArtistLeaderboard = pgTable(
  "users_artist_leaderboard",
  {
    timestamp: timestampWithTimezone("timestamp").notNull(),
    userId: varchar("user_id", { length: 28 }).notNull(),
    artistId: varchar("artist_id", { length: 36 }).notNull(),
    artistRankForUser: integer("artist_rank_for_user").notNull(),
    userRankAmongstOtherUsers: integer(
      "user_rank_amongst_other_users",
    ).notNull(),
  },
  (table) => ({
    userArtistId: primaryKey({
      columns: [table.userId, table.timestamp, table.artistId],
      name: "users_artist_leaderboard_id",
    }),
    userIdIdx: index("user_id_timestamp_users_artist_leaderboard_idx").on(
      table.userId,
      table.timestamp,
    ),
  }),
);

export const usersArtistLeaderboardRelations = relations(
  usersArtistLeaderboard,
  ({ one }) => ({
    user: one(users, {
      fields: [usersArtistLeaderboard.userId],
      references: [users.id],
    }),
  }),
);
