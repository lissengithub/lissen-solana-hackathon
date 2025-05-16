import { z } from "zod";
import { publicProcedure } from "../../../../trpc";
import { db, fmlContests, desc, and, gte, lte } from "@libs/neon";
import { getParticipantCount } from "../../helpers";

const schema = {
  input: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
  output: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      about: z.string().nullable(),
      howItWorks: z.string().nullable(),
      image: z.string().nullable(),
      startDate: z.string(),
      endDate: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
      prizeAmount: z.number(),
      participantCount: z.number().optional(), // Optional for backwards compatibility
    }),
  ),
};

export default publicProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input }) => {
    const { logger } = ctx;

    logger.info("Getting all FML contests");

    const contests = await db.user.query.fmlContests.findMany({
      where:
        input?.startDate && input.endDate
          ? and(
              gte(fmlContests.startDate, input.startDate),
              lte(fmlContests.endDate, input.endDate),
            )
          : undefined,
      orderBy: desc(fmlContests.createdAt),
      with: {
        prizes: true,
      },
    });

    const contestsWithPrizeAmount = contests.map((contest) => ({
      ...contest,
      prizeAmount: contest.prizes.reduce(
        (acc, prize) => acc + prize.prizeValue,
        0,
      ),
    }));

    const contestsWithParticipantCount = await Promise.all(
      contestsWithPrizeAmount.map(async (contest) => ({
        ...contest,
        participantCount: await getParticipantCount(contest.id),
      })),
    );

    return contestsWithParticipantCount;
  });
