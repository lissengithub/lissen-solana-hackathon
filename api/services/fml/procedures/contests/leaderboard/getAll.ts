import { z } from "zod";
import { publicProcedure } from "../../../../../trpc";
import {
  db,
  fmlContestLeaderboards,
  eq,
  desc,
  fmlContests,
  users,
  asc,
  and,
} from "@libs/neon";
import { TRPCError } from "@trpc/server";
import _ from "lodash";
import dayjs from "dayjs";

const schema = {
  input: z.object({
    contestId: z.string(),
    limit: z.number().optional(),
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
    }),
  ),
};

export default publicProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input: { contestId, limit } }) => {
    const { logger } = ctx;

    logger.info("Getting leaderboard for contest", { contestId });

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

    console.log("latestDate", latestDate);

    let leaderboard = await db.user.query.fmlContestLeaderboards.findMany({
      where: and(
        eq(fmlContestLeaderboards.contestId, contestId),
        latestDate ? eq(fmlContestLeaderboards.date, latestDate) : undefined,
      ),
      orderBy: [asc(fmlContestLeaderboards.rank)],
      limit,
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

    // If contest has just started, we dont have a leaderboard for that contest yet
    // So we get the overall top players based on total points
    if (leaderboard.length === 0) {
      const overallLeaderboard =
        await db.user.query.fmlContestLeaderboards.findMany({
          where: latestDate
            ? eq(fmlContestLeaderboards.date, latestDate)
            : undefined,
          orderBy: [desc(fmlContestLeaderboards.totalPoints)],
          limit: limit ? limit + 20 : undefined, // We add 20 to the limit to account for duplicates
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

      const overallLeaderboardUniqueUsers = _.uniqBy(
        overallLeaderboard,
        "userId",
      ).slice(0, limit);

      leaderboard = overallLeaderboardUniqueUsers.map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

      if (leaderboard.length === 0) {
        // We dont have any user leaderboard entries yet
        // Return users with 0 points
        const usersInDb = await db.user.query.users.findMany({
          limit,
          orderBy: asc(users.createdAt),
          columns: {
            id: true,
            name: true,
            image: true,
          },
        });

        leaderboard = usersInDb.map((user, index) => ({
          user,
          rank: index + 1,
          totalPoints: 0,
          contestId,
          date: dayjs().toISOString(),
          rosterHistory: [],
          userId: user.id,
        }));
      }
    }

    return leaderboard;
  });
