import { z } from "zod";
import { publicProcedure } from "../../../../../trpc";
import {
  db,
  eq,
  fmlContests,
  fmlContestParticipants,
  fmlArtistPointsLog,
  inArray,
  sum,
  fmlArtistUserPoints,
} from "@libs/neon";
import { TRPCError } from "@trpc/server";

const schema = {
  input: z.object({
    gameId: z.string(),
  }),
  output: z.array(
    z.object({
      userId: z.string(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        image: z.string().nullable(),
      }),
      gameId: z.string(),
      rank: z.number(),
      userPoints: z.number(),
      artistPoints: z.number(),
      totalPoints: z.number(),
    }),
  ),
};

export default publicProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx: { uid, logger }, input: { gameId } }) => {
    logger.info(`Getting leaderboard for game ${gameId}`);

    const game = await db.user.query.fmlContests.findFirst({
      where: eq(fmlContests.id, gameId),
    });

    if (!game) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" });
    }

    logger.info(`Getting participants for game ${gameId}`);

    const participants = await db.user.query.fmlContestParticipants.findMany({
      where: eq(fmlContestParticipants.contestId, gameId),
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

    logger.info(`Got ${participants.length} participants for game ${gameId}`);

    const scArtistIds = participants
      .map((participant) => participant.scArtistIds)
      .flat();

    const uniqueScArtistIds = [...new Set(scArtistIds)];

    const artistPoints = await db.catalog
      .select({
        scArtistId: fmlArtistPointsLog.scArtistId,
        points: sum(fmlArtistPointsLog.pointsAwarded),
      })
      .from(fmlArtistPointsLog)
      .where(inArray(fmlArtistPointsLog.scArtistId, uniqueScArtistIds))
      .groupBy(fmlArtistPointsLog.scArtistId);

    const userPoints = await db.user
      .select({
        userId: fmlArtistUserPoints.userId,
        points: sum(fmlArtistUserPoints.points),
      })
      .from(fmlArtistUserPoints)
      .where(eq(fmlArtistUserPoints.contestId, gameId))
      .groupBy(fmlArtistUserPoints.userId);

    logger.info(`Got ${artistPoints.length} artist points for game ${gameId}`);

    const participantsWithPoints = participants.map((participant) => {
      const userArtists = artistPoints.filter((point) =>
        participant.scArtistIds.includes(point.scArtistId),
      );

      const userUserPoints = userPoints
        .filter((point) => point.userId === participant.userId)
        .reduce((acc, curr) => acc + parseInt(curr.points || "0"), 0);

      const userArtistPoints = userArtists.reduce(
        (acc, curr) => acc + parseInt(curr.points || "0"),
        0,
      );

      return {
        userId: participant.userId,
        user: participant.user,
        gameId,
        userPoints: userUserPoints,
        artistPoints: userArtistPoints,
        totalPoints: userUserPoints + userArtistPoints,
      };
    });

    logger.info(
      `Got ${participantsWithPoints.length} participants with points for game ${gameId}`,
    );

    const sortedParticipants = participantsWithPoints.sort(
      (a, b) => b.totalPoints - a.totalPoints,
    );

    const rankedParticipants = sortedParticipants.map((participant, index) => ({
      ...participant,
      rank: index + 1,
    }));

    const rankedTopFiveParticipants = rankedParticipants.slice(0, 5);

    if (uid) {
      // User is logged in, so we need to get their rank
      const userInLeaderboard = rankedParticipants.find(
        (p) => p.userId === uid,
      );

      if (userInLeaderboard && userInLeaderboard.rank >= 6) {
        // User is not in the top 5, so we need to add them to the results
        rankedTopFiveParticipants.push(userInLeaderboard);
      }
    }

    logger.info(
      `Got ${rankedTopFiveParticipants.length} ranked top 5 participants for game ${gameId}`,
    );

    return rankedTopFiveParticipants;
  });
