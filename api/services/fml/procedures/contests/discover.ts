import { z } from "zod";
import { publicProcedure } from "../../../../trpc";
import {
  db,
  fmlContests,
  countDistinct,
  fmlContestLeaderboards,
  eq,
  asc,
  gte,
} from "@libs/neon";
import dayjs from "dayjs";

const schema = {
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
      participantCount: z.number(),
    }),
  ),
};

const getParticipantCount = async (contestId: string) => {
  let participantCount = 0;

  await db.user
    .select({ count: countDistinct(fmlContestLeaderboards.userId) })
    .from(fmlContestLeaderboards)
    .where(eq(fmlContestLeaderboards.contestId, contestId))
    .then((res) => {
      participantCount = res.at(0)?.count ?? 0;
    });

  return participantCount;
};

/**
 * Get all FML contests that are currently active or upcoming
 */
export default publicProcedure.output(schema.output).query(async ({ ctx }) => {
  const { logger } = ctx;

  logger.info("Getting all FML contests");

  const contests = await db.user.query.fmlContests.findMany({
    where: gte(fmlContests.endDate, dayjs().toISOString()),
    orderBy: asc(fmlContests.startDate),
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
