import { z } from "zod";
import { protectedProcedure } from "../../../../trpc";
import { and, db, fmlContests, gte, lte } from "@libs/neon";
import dayjs from "dayjs";

const schema = {
  output: z.number(),
};

export default protectedProcedure
  .output(schema.output)
  .query(async ({ ctx, input: contestId }) => {
    const { logger } = ctx;

    logger.info("Getting total prize pool for contest", { contestId });

    const date = dayjs().toISOString();

    // Get all contests that are currently active
    const contests = await db.user.query.fmlContests.findMany({
      where: and(
        lte(fmlContests.startDate, date),
        gte(fmlContests.endDate, date),
      ),
      with: {
        prizes: true,
      },
    });

    const total = contests.reduce(
      (acc, contest) =>
        acc + contest.prizes.reduce((acc, prize) => acc + prize.prizeValue, 0),
      0,
    );

    return total;
  });
