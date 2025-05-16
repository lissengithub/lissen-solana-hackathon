import { z } from "zod";
import { publicProcedure } from "../../../../trpc";
import {
  db,
  fmlContests,
  eq,
  fmlContestLeaderboards,
  countDistinct,
} from "@libs/neon";
import { TRPCError } from "@trpc/server";

const schema = {
  input: z.string(),
  output: z.object({
    id: z.string(),
    name: z.string(),
    about: z.string().nullable(),
    howItWorks: z.string().nullable(),
    image: z.string().nullable(),
    startDate: z.string(),
    endDate: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    leaderboardCount: z.number().optional(),
    prizeAmount: z.number(),
  }),
};

export default publicProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input: id }) => {
    const { logger } = ctx;

    logger.info("Getting FML contest by ID", { id });

    const contest = await db.user.query.fmlContests.findFirst({
      where: eq(fmlContests.id, id),
      with: {
        prizes: true,
      },
    });

    if (!contest) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Contest not found",
      });
    }

    const contestWithPrizeAmount = {
      ...contest,
      prizeAmount: contest.prizes.reduce(
        (acc, prize) => acc + prize.prizeValue,
        0,
      ),
    };

    let leaderboardCount = 0;

    await db.user
      .select({ count: countDistinct(fmlContestLeaderboards.userId) })
      .from(fmlContestLeaderboards)
      .where(eq(fmlContestLeaderboards.contestId, id))
      .then((res) => {
        leaderboardCount = res.at(0)?.count ?? 0;
      });

    return {
      ...contestWithPrizeAmount,
      leaderboardCount,
    };
  });
