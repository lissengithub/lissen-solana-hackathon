import { z } from "zod";
import { publicProcedure } from "../../../../trpc";
import { db, fmlLeagues, fmlContests, desc, and, gte, lte } from "@libs/neon";
import dayjs from "dayjs";

const schema = {
  output: z.array(
    z.object({
      id: z.string(),
      displayName: z.string(),
      color: z.string().nullable(),
      contests: z.array(
        z.object({
          id: z.string(),
        }),
      ),
      totalPrizePool: z.number(),
      participantsCount: z.number(),
    }),
  ),
};

export default publicProcedure
  .output(schema.output)
  .query(async ({ ctx: { logger } }) => {
    logger.info("Getting all leagues");

    const leaguesInDb = await db.user.query.fmlLeagues.findMany({
      orderBy: [desc(fmlLeagues.createdAt)],
      columns: {
        id: true,
        displayName: true,
        color: true,
      },
      with: {
        contests: {
          where: and(
            lte(fmlContests.startDate, dayjs().utc().toISOString()),
            gte(fmlContests.endDate, dayjs().utc().toISOString()),
          ),
          columns: {
            id: true,
          },
          with: {
            prizes: {
              columns: {
                prizeValue: true,
              },
            },
            participants: {
              columns: {
                id: true,
              },
            },
          },
        },
      },
    });

    logger.info(`Found ${leaguesInDb.length} leagues`);

    const leaguesWithContests = leaguesInDb.filter(
      (league) => league.contests?.length > 0,
    );

    const leagues = leaguesWithContests.map((league) => {
      return {
        ...league,
        participantsCount: league.contests.reduce(
          (acc, contest) => acc + contest.participants.length,
          0,
        ),
        totalPrizePool: league.contests.reduce(
          (acc, contest) =>
            acc +
            contest.prizes.reduce((sum, prize) => sum + prize.prizeValue, 0),
          0,
        ),
      };
    });

    return leagues;
  });
