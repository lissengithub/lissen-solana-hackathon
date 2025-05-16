import { protectedProcedure } from "../../../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  db,
  fmlFeedLikes,
  eq,
  and,
  fmlArtistPointsLog,
  fmlArtistUserPoints,
  fmlContestParticipants,
  inArray,
  gte,
  lte,
  fmlContests,
  fmlRosters,
} from "@libs/neon";
import Logger from "@libs/logger";
import { rewardGem } from "../../../gems/procedures/rewardGem";

const schema = {
  input: z.object({
    logId: z.number(),
    leagueId: z.string(),
  }),
  output: z.object({
    liked: z.boolean(),
  }),
};

const handleUserPointsForLike = async (
  userId: string,
  logId: number,
  liked: boolean,
  leagueId: string,
  logger: Logger,
) => {
  const logEntry = await db.catalog
    // eslint-disable-next-line no-restricted-syntax -- we need to override the territory code for this query
    .query({ territoryCode: "OVERRIDE" })
    .fmlArtistPointsLog.findFirst({
      where: eq(fmlArtistPointsLog.logId, logId),
    });

  if (!logEntry) {
    logger.error("No log entry found for logId", { logId });
    return;
  }

  const { scArtistId } = logEntry;

  logger.info("logEntry", logEntry);

  try {
    if (liked) {
      logger.info(
        `Awarding user points for liking a post by ${scArtistId} for ${userId}`,
      );

      const potentialContestIds =
        await db.user.query.fmlContestParticipants.findMany({
          where: and(eq(fmlContestParticipants.userId, userId)),
          columns: {
            contestId: true,
          },
        });

      logger.info("potentialContestIds", potentialContestIds);

      const eligibleContests = await db.user.query.fmlContests.findMany({
        where: and(
          inArray(
            fmlContests.id,
            potentialContestIds.map((entry) => entry.contestId),
          ),
          lte(fmlContests.startDate, new Date().toISOString()),
          gte(fmlContests.endDate, new Date().toISOString()),
        ),
        columns: {
          id: true,
        },
      });

      const isUsersArtist = await db.user.query.fmlRosters.findFirst({
        where: and(
          eq(fmlRosters.userId, userId),
          eq(fmlRosters.scArtistId, scArtistId),
          eq(fmlRosters.leagueId, leagueId),
        ),
      });

      const pointsAmount = isUsersArtist ? 2 : 1;

      await db.user.insert(fmlArtistUserPoints).values(
        eligibleContests.map((entry) => ({
          scArtistId,
          userId,
          points: pointsAmount,
          contestId: entry.id,
          date: new Date().toISOString().split("T")[0],
          artistPointsLogId: logEntry.logId,
        })),
      );

      await rewardGem(
        {
          action: "fml_like_feed_item",
          amount: pointsAmount,
          artistId: scArtistId,
          accessId: leagueId,
          userVoucherId: null,
          songId: null,
        },
        true,
        userId,
        logger,
      );
    } else {
      logger.info(
        `deleting ${userId} artist user points for ${logEntry.logId} for date ${new Date().toISOString().split("T")[0]}`,
      );
      await db.user
        .delete(fmlArtistUserPoints)
        .where(
          and(
            eq(fmlArtistUserPoints.userId, userId),
            eq(fmlArtistUserPoints.artistPointsLogId, logEntry.logId),
            eq(
              fmlArtistUserPoints.date,
              new Date().toISOString().split("T")[0],
            ),
          ),
        );
    }
  } catch (error) {
    logger.warn("Error awarding user points for like", {
      error,
      userId,
      logId,
    });
  }
};

export default protectedProcedure
  .input(schema.input)
  .output(schema.output)
  .mutation(async ({ ctx, input }) => {
    const { uid: userId, logger } = ctx;
    const { logId, leagueId } = input;

    logger.info("Toggling like on feed item", { userId, logId });

    try {
      let finalLiked = false;

      // Check if like exists
      const existingLike = await db.user.query.fmlFeedLikes.findFirst({
        where: and(
          eq(fmlFeedLikes.userId, userId),
          eq(fmlFeedLikes.logId, logId),
        ),
      });

      if (existingLike) {
        // Unlike: Delete the like
        await db.user
          .delete(fmlFeedLikes)
          .where(
            and(eq(fmlFeedLikes.userId, userId), eq(fmlFeedLikes.logId, logId)),
          );

        logger.info("Unliked feed item", { userId, logId });

        finalLiked = false;
      } else {
        // Like: Insert a new like
        await db.user.insert(fmlFeedLikes).values({
          userId,
          logId,
        });

        logger.info("Liked feed item", { userId, logId });

        finalLiked = true;
      }

      await handleUserPointsForLike(
        userId,
        logId,
        finalLiked,
        leagueId,
        logger,
      );

      return { liked: finalLiked };
    } catch (error) {
      logger.error("Error toggling like on feed item", {
        error,
        userId,
        logId,
      });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to toggle like on feed item",
        cause: error,
      });
    }
  });
