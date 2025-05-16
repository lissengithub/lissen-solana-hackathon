import { protectedProcedure } from "../../../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db, eq, and, fmlFeedLikes, count } from "@libs/neon";

const schema = {
  input: z.object({
    logId: z.number(),
  }),
  output: z.object({
    logId: z.number(),
    isLiked: z.boolean(),
    count: z.number(),
  }),
};

export default protectedProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input }) => {
    const { uid: userId, logger } = ctx;
    const { logId } = input;

    logger.info("Getting liked status for feed item", { userId, logId });

    try {
      // Check if the user has liked this specific logId
      const like = await db.user.query.fmlFeedLikes.findFirst({
        where: and(
          eq(fmlFeedLikes.userId, userId),
          eq(fmlFeedLikes.logId, logId),
        ),
        columns: {
          logId: true,
        },
      });

      // Count total likes for this logId (from all users)
      const totalLikes = await db.user
        .select({ count: count() })
        .from(fmlFeedLikes)
        .where(eq(fmlFeedLikes.logId, logId));

      // Return a single object with logId, isLiked status, and count
      return {
        logId,
        isLiked: !!like,
        count: totalLikes[0]?.count || 0,
      };
    } catch (error) {
      logger.error("Error getting liked status for feed item", {
        error,
        userId,
        logId,
      });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get liked status for feed item",
        cause: error,
      });
    }
  });
