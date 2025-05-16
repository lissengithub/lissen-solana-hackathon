import { z } from "zod";
import { protectedProcedure } from "../../../../../trpc";
import {
  db,
  fmlContestLeaderboards,
  eq,
  and,
  asc,
  fmlContests,
  desc,
} from "@libs/neon";
import { TRPCError } from "@trpc/server";

const schema = {
  input: z.object({
    contestId: z.string(),
    userId: z.string(),
    window: z.number().optional().default(5),
  }),
  output: z.array(
    z.object({
      userId: z.string(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        image: z.string().nullable(),
      }),
      contestId: z.string(),
      rank: z.number(),
      totalPoints: z.number(),
      rosterHistory: z.array(
        z.object({
          scArtistId: z.string(),
          totalPoints: z.number(),
        }),
      ),
    }),
  ),
};

export default protectedProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input }) => {
    const { logger } = ctx;
    const { contestId, userId, window } = input;

    logger.info("Getting mini leaderboard for contest and user", {
      contestId,
      userId,
      window,
    });

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

    const latestDate = (
      await db.user.query.fmlContestLeaderboards.findFirst({
        where: eq(fmlContestLeaderboards.contestId, contestId),
        orderBy: desc(fmlContestLeaderboards.date),
        columns: {
          date: true,
        },
      })
    )?.date;

    // First, find the user's rank
    const userEntry = await db.user.query.fmlContestLeaderboards.findFirst({
      where: and(
        eq(fmlContestLeaderboards.contestId, contestId),
        eq(fmlContestLeaderboards.userId, userId),
        latestDate ? eq(fmlContestLeaderboards.date, latestDate) : undefined,
      ),
    });

    if (!userEntry) {
      // user not on leaderboard, get top 5
      const topEntries = await db.user.query.fmlContestLeaderboards.findMany({
        where: and(
          eq(fmlContestLeaderboards.contestId, contestId),
          latestDate ? eq(fmlContestLeaderboards.date, latestDate) : undefined,
        ),
        orderBy: asc(fmlContestLeaderboards.rank),
        limit: 5,
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return topEntries.map((entry) => ({
        ...entry,
        rosterHistory: entry.rosterHistory.map((history) => ({
          scArtistId: history.sc_artist_id,
          totalPoints: history.total_points,
        })),
      }));
    }

    // Get entries above and below the user's rank
    const windowEntries = await db.user.query.fmlContestLeaderboards.findMany({
      where: and(
        eq(fmlContestLeaderboards.contestId, contestId),
        latestDate ? eq(fmlContestLeaderboards.date, latestDate) : undefined,
      ),
      orderBy: asc(fmlContestLeaderboards.rank),
      limit: window * 2 + 1,
      offset: Math.max(0, userEntry.rank - window - 1),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return windowEntries.map((entry) => ({
      ...entry,
      rosterHistory: entry.rosterHistory.map((history) => ({
        scArtistId: history.sc_artist_id,
        totalPoints: history.total_points,
      })),
    }));
  });
