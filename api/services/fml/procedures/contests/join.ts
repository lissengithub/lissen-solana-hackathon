import { protectedProcedure } from "../../../../trpc";
import { z } from "zod";
import { db, eq, and, fmlContestParticipants, fmlContests } from "@libs/neon";
import { TRPCError } from "@trpc/server";

const schema = {
  input: z.object({
    contestId: z.string().uuid(),
    scArtistIds: z.array(z.string()),
  }),
  output: z.object({
    success: z.boolean(),
  }),
};

export default protectedProcedure
  .input(schema.input)
  .output(schema.output)
  .mutation(async ({ ctx, input }) => {
    const { uid, logger } = ctx;
    const { contestId } = input;

    logger.info("User attempting to join contest", { uid, contestId });

    // 1. Check if the contest exists
    const contest = await db.user.query.fmlContests.findFirst({
      where: eq(fmlContests.id, contestId),
    });

    if (!contest) {
      logger.warn("Attempted to join non-existent contest", { contestId });
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Contest not found.",
      });
    }

    // 2. Check if user has already joined this contest
    const existingParticipant =
      await db.user.query.fmlContestParticipants.findFirst({
        where: and(
          eq(fmlContestParticipants.userId, uid),
          eq(fmlContestParticipants.contestId, contestId),
        ),
        columns: { id: true },
      });

    if (existingParticipant) {
      logger.info("User already joined this contest", { uid, contestId });
      return {
        success: true,
        participantId: existingParticipant.id,
      };
    }

    // 3. Create the participation record
    try {
      const newParticipant = await db.user
        .insert(fmlContestParticipants)
        .values({
          userId: uid,
          contestId: contestId,
          scArtistIds: input.scArtistIds,
        })
        .returning({ id: fmlContestParticipants.id });

      if (!newParticipant || newParticipant.length === 0) {
        logger.error("Failed to create fmlContestParticipants record", {
          uid,
          contestId,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not join contest due to a server issue.",
        });
      }

      logger.info("User successfully joined contest", {
        uid,
        contestId,
      });
      return {
        success: true,
      };
    } catch (error) {
      logger.error("Error inserting user into fmlContestParticipants", {
        uid,
        contestId,
        error,
      });
      // Check for specific database errors if necessary
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to join contest.",
      });
    }
  });
