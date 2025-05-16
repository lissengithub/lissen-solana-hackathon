import { z } from "zod";
import { protectedProcedure } from "../../../../trpc";
import { db, fmlContestPrizes, eq, fmlContests } from "@libs/neon";
import { TRPCError } from "@trpc/server";

const schema = {
  input: z.string(),
  output: z.object({
    totalPrizePool: z.number(),
  }),
};

export default protectedProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input: contestId }) => {
    const { logger } = ctx;

    logger.info("Getting total prize pool for contest", { contestId });

    // Verify the contest exists
    const contest = await db.user.query.fmlContests.findFirst({
      where: eq(fmlContests.id, contestId),
    });

    if (!contest) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Contest not found",
      });
    }

    const result = await db.user.query.fmlContestPrizes.findMany({
      where: eq(fmlContestPrizes.contestId, contestId),
    });

    const total = result.reduce((acc, prize) => acc + prize.prizeValue, 0);

    return {
      totalPrizePool: total,
    };
  });
