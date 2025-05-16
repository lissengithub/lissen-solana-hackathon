import { z } from "zod";
import { protectedProcedure } from "../../../../trpc";
import { db, eq, fmlRosters, and } from "@libs/neon";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);

const schema = {
  input: z.object({
    artists: z.array(
      z.object({
        scArtistId: z.string(),
        position: z.number(),
      }),
    ),
    leagueId: z.string(),
  }),
  output: z.object({
    success: z.boolean(),
  }),
};

export default protectedProcedure
  .input(schema.input)
  .output(schema.output)
  .mutation(async ({ ctx, input }) => {
    const { logger, uid } = ctx;
    const { artists, leagueId } = input;

    logger.info("Updating roster", {
      uid,
      leagueId,
      scArtistIds: artists.map((artist) => artist.scArtistId),
    });

    if (!artists) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No artists provided",
      });
    }

    // Check if adding would exceed limit
    if (artists.length > 5) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Cannot add ${artists.length} artists. Maximum of 5 artists allowed in roster.`,
      });
    }

    await db.user
      .delete(fmlRosters)
      .where(
        and(eq(fmlRosters.userId, uid), eq(fmlRosters.leagueId, leagueId)),
      );

    // Add artists to roster
    if (artists?.length) {
      await db.user.insert(fmlRosters).values(
        artists.map(({ scArtistId, position }) => ({
          userId: uid,
          scArtistId,
          position,
          leagueId,
        })),
      );
    }

    return {
      success: true,
    };
  });
