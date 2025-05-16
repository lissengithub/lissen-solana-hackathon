import { z } from "zod";
import { publicProcedure } from "../../../../trpc";
import {
  db,
  fmlContests,
  desc,
  and,
  gte,
  eq,
  inArray,
  lte,
  fmlArtistTraits,
  fmlTraits,
  fmlContestTraits,
} from "@libs/neon";
import dayjs from "dayjs";
import { getParticipantCount } from "../../helpers";

const schema = {
  input: z.object({
    scArtistId: z.string(),
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
    const { scArtistId } = input;

    logger.info(`Getting contests for artist: ${scArtistId}`);

    // Get all traits for the artist
    const artistTraitIds = await db.catalog
      // eslint-disable-next-line no-restricted-syntax -- fml artist traits
      .query({ territoryCode: "OVERRIDE" })
      .fmlArtistTraits.findMany({
        where: eq(fmlArtistTraits.scArtistId, scArtistId),
        columns: {
          traitId: true,
        },
      })
      .then((res) => (res.length > 0 ? res.map((trait) => trait.traitId) : []));

    logger.info(
      `Found ${artistTraitIds.length} traits for artist: ${scArtistId}`,
    );

    const startOfWeek = dayjs().utc().startOf("week").toISOString();
    const endOfWeek = dayjs().utc().endOf("week").toISOString();

    const contestIds = await db.user
      .select({
        id: fmlContests.id,
      })
      .from(fmlContests)
      .innerJoin(
        fmlContestTraits,
        eq(fmlContests.id, fmlContestTraits.contestId),
      )
      .where(
        and(
          gte(fmlContests.startDate, startOfWeek),
          lte(fmlContests.endDate, endOfWeek),
          inArray(fmlContestTraits.traitId, artistTraitIds),
        ),
      )
      .orderBy(desc(fmlContests.startDate))
      .then((res) =>
        res && res.length > 0 ? res.map((contest) => contest.id) : [],
      );

    const contests = await db.user.query.fmlContests.findMany({
      where: inArray(fmlContests.id, contestIds),
      orderBy: desc(fmlContests.startDate),
      with: {
        prizes: {
          columns: {
            prizeValue: true,
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

    logger.info(
      `Found ${contests.length} active contest details for artist: ${scArtistId}`,
    );

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

    const contestsWithDetails = await Promise.all(
      contests.map(async (contest) => {
        const contestTraitIds = contest.traits.map((trait) => trait.traitId);
        const contestTraits = catalogTraits.filter((trait) =>
          contestTraitIds.includes(trait.id),
        );
        const participantCount = await getParticipantCount(contest.id);

        return {
          ...contest,
          league: contest.league ?? null,
          traits: contestTraits,
          prizeAmount: contest.prizes.reduce(
            (acc, prize) => acc + prize.prizeValue,
            0,
          ),
          participantCount,
        };
      }),
    );

    return contestsWithDetails;
  });
