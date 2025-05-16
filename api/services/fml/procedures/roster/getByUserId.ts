import { z } from "zod";
import { protectedProcedure } from "../../../../trpc";
import { db, fmlRosters, eq, and, asc } from "@libs/neon";
import dayjs from "dayjs";
import week from "dayjs/plugin/weekOfYear";

dayjs.extend(week);

const schema = {
  input: z.object({
    userId: z.string(),
  }),
  output: z.array(
    z.object({
      scArtistId: z.string(),
      artistName: z.string(),
      artistImage: z.string().nullable(),
      position: z.number(),
      totalPoints: z.number(),
    }),
  ),
};

export default protectedProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input }) => {
    const { logger } = ctx;
    const { userId } = input;

    logger.info("Getting roster for user", { userId });

    const roster = await db.user.query.fmlRosters.findMany({
      where: and(eq(fmlRosters.userId, userId)),
      orderBy: asc(fmlRosters.position),
      with: {
        artistMetrics: true,
      },
    });

    const rosterWithArtists = roster.map((roster) => {
      const stat = roster.artistMetrics;

      if (!stat) {
        return null;
      }

      return {
        scArtistId: roster.scArtistId,
        artistName: stat.name,
        artistImage: stat.image,
        position: roster.position,
        totalPoints: stat.totalPoints,
      };
    });

    return rosterWithArtists.filter((roster) => roster !== null);
  });
