import { protectedProcedure } from "../../../../trpc";
import { z } from "zod";
import { db, eq, and, fmlContestParticipants } from "@libs/neon";

const schema = {
  input: z.object({
    contestId: z.string().uuid(),
  }),
  output: z.object({
    isJoined: z.boolean(),
  }),
};

export default protectedProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input }) => {
    const { uid, logger } = ctx;
    const { contestId } = input;

    logger.info("Checking if user has joined contest", { uid, contestId });

    // Check if user has already joined this contest
    const existingParticipant =
      await db.user.query.fmlContestParticipants.findFirst({
        where: and(
          eq(fmlContestParticipants.userId, uid),
          eq(fmlContestParticipants.contestId, contestId),
        ),
        columns: { id: true },
      });

    return {
      isJoined: !!existingParticipant,
    };
  });
