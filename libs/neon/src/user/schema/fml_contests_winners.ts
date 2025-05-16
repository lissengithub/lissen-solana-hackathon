import { pgTable, varchar, jsonb } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";

export const fmlContestsWinners = pgTable("fml_contests_winners", {
  ...timestamps,
  contestId: varchar("contest_id", { length: 36 }).primaryKey(),
  winners: jsonb("winners").notNull().$type<
    {
      userId: string;
      rank: number;
    }[]
  >(),
});
