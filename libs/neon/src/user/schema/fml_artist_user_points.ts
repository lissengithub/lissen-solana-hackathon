import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  index,
  integer,
  date,
  primaryKey,
} from "drizzle-orm/pg-core";
import { fmlContests } from "./fml_contests";
import { users } from "./users";
import { timestamps } from "../../utils/fields";
export const fmlArtistUserPoints = pgTable(
  "fml_artist_user_points",
  {
    ...timestamps,
    scArtistId: varchar("sc_artist_id", { length: 36 }),
    userId: varchar("user_id", { length: 36 }),
    points: integer("points").notNull(),
    contestId: varchar("contest_id", { length: 36 }).notNull(),
    artistPointsLogId: integer("artist_points_log_id"),
    date: date("date").notNull(),
  },
  (table) => {
    return {
      fmlArtistUserPointsPk: primaryKey({
        columns: [table.scArtistId, table.userId, table.contestId, table.date],
        name: "fml_artist_user_points_pk",
      }),
      scArtistIdIdx: index("fml_artist_user_points_sc_artist_id_idx").on(
        table.scArtistId,
      ),
      userIdIdx: index("fml_artist_user_points_user_id_idx").on(table.userId),
      contestIdIdx: index("fml_artist_user_points_contest_id_idx").on(
        table.contestId,
      ),
    };
  },
);

export type FmlArtistUserPoints = typeof fmlArtistUserPoints.$inferSelect;

export const fmlArtistUserPointsRelations = relations(
  fmlArtistUserPoints,
  ({ one }) => ({
    contest: one(fmlContests, {
      fields: [fmlArtistUserPoints.contestId],
      references: [fmlContests.id],
    }),
    user: one(users, {
      fields: [fmlArtistUserPoints.userId],
      references: [users.id],
    }),
  }),
);
