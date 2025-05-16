import { z } from "zod";
import { publicProcedure } from "../../../../trpc";
import {
  db,
  fmlContests,
  desc,
  and,
  gte,
  lte,
  eq,
  inArray,
  fmlTraits,
  fmlContestPrizes,
  asc,
} from "@libs/neon";
import { getParticipantCount } from "../../helpers";

const schema = {
  input: z.object({
    leagueId: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
  output: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      image: z.string().nullable(),
      startDate: z.string(),
      endDate: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
      prizeAmount: z.number(),
      prizes: z.array(
        z.object({
          id: z.string(),
          prizeValue: z.number(),
          rankStart: z.number(),
          rankEnd: z.number(),
          prizeDescription: z.string(),
          prizeType: z.string(),
        }),
      ),
      participantCount: z.number(),
      league: z
        .object({
          id: z.string(),
          displayName: z.string(),
          color: z.string().nullable(),
        })
        .nullable(),
      traits: z.array(
        z.object({
          id: z.string(),
          type: z.string(),
          value: z.string(),
        }),
      ),
    }),
  ),
};

export default publicProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input }) => {
    const { logger } = ctx;
    const { leagueId, startDate, endDate } = input;

    logger.info(
      `Getting contests for leagueId: ${leagueId} with startDate: ${startDate} and endDate: ${endDate}`,
    );

    const whereConditions = [eq(fmlContests.leagueId, input.leagueId)];

    // Add date range conditions if provided
    if (startDate && endDate) {
      whereConditions.push(
        gte(fmlContests.startDate, startDate),
        lte(fmlContests.endDate, endDate),
      );
    }

    const contests = await db.user.query.fmlContests.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: desc(fmlContests.createdAt),
      with: {
        prizes: {
          orderBy: asc(fmlContestPrizes.rankStart),
          columns: {
            id: true,
            prizeValue: true,
            rankStart: true,
            rankEnd: true,
            prizeDescription: true,
            prizeType: true,
          },
        },
        league: {
          columns: {
            id: true,
            displayName: true,
            color: true,
          },
        },
        traits: {
          columns: {
            traitId: true,
          },
        },
      },
    });

    logger.info(`Found ${contests.length} contests for leagueId: ${leagueId}`);

    const traitIds = contests.flatMap((contest) =>
      contest.traits.map((trait) => trait.traitId),
    );

    const catalogTraits = await db.catalog
      // eslint-disable-next-line no-restricted-syntax -- traits
      .query({ territoryCode: "OVERRIDE" })
      .fmlTraits.findMany({
        where: inArray(fmlTraits.id, traitIds),
        columns: {
          id: true,
          type: true,
          value: true,
        },
      });

    const contestsWithPrizeAmount = contests.map((contest) => {
      const contestTraitIds = contest.traits.map((trait) => trait.traitId);
      const contestTraits = catalogTraits.filter((trait) =>
        contestTraitIds.includes(trait.id),
      );

      return {
        ...contest,
        league: contest.league ?? null,
        traits: contestTraits,
        prizeAmount: contest.prizes.reduce(
          (acc, prize) => acc + prize.prizeValue,
          0,
        ),
      };
    });

    const contestsWithParticipantCount = await Promise.all(
      contestsWithPrizeAmount.map(async (contest) => ({
        ...contest,
        participantCount: await getParticipantCount(contest.id),
      })),
    );

    return contestsWithParticipantCount;
  });
