import { z } from "zod";
import { publicProcedure } from "../../../../../trpc";
import { db, fmlContestPrizes, eq, asc, fmlContests } from "@libs/neon";
import { TRPCError } from "@trpc/server";

const schema = {
  input: z.string(),
  output: z.array(
    z.object({
      id: z.string(),
      contestId: z.string(),
      rankStart: z.number(),
      rankEnd: z.number(),
      prizeDescription: z.string().nullable(),
      prizeType: z.string(),
      prizeValue: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
};

export default publicProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input: contestId }) => {
    const { logger } = ctx;

    logger.info("Getting prizes for contest", { contestId });

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

    // Original implementation
    const prizes = await db.user.query.fmlContestPrizes.findMany({
      where: eq(fmlContestPrizes.contestId, contestId),
      orderBy: [asc(fmlContestPrizes.rankStart)],
    });

    return prizes;
  });
