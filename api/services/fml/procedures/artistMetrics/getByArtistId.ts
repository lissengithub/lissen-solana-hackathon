import { z } from "zod";
import { publicProcedure } from "../../../../trpc";
import { db, eq, fmlArtistMapping, userFmlArtistMetrics } from "@libs/neon";
import { TRPCError } from "@trpc/server";

const stringToNumber = z.string().transform((val) => Number(val));

const schema = {
  input: z.object({
    lissenArtistId: z.string().optional(),
    scArtistId: z.string().optional(),
  }),
  output: z.object({
    scArtistId: z.string(),
    artistName: z.string(),
    artistImage: z.string().nullable(),
    // Social metrics
    spotifyFollowerCount: z.number().nullable(),
    spotifyFollowerPct: stringToNumber.nullable(),
    youtubeFollowerCount: z.number().nullable(),
    youtubeFollowerPct: stringToNumber.nullable(),
    soundcloudFollowerCount: z.number().nullable(),
    soundcloudFollowerPct: stringToNumber.nullable(),
    tiktokFollowerCount: z.number().nullable(),
    tiktokFollowerPct: stringToNumber.nullable(),
    instagramFollowerCount: z.number().nullable(),
    instagramFollowerPct: stringToNumber.nullable(),
    // Stream metrics
    soundcloudPlays: z.number().nullable(),
    soundcloudPlaysPct: stringToNumber.nullable(),
    spotifyStreams: z.number().nullable(),
    spotifyStreamsPct: stringToNumber.nullable(),
    tiktokStreams: z.number().nullable(),
    tiktokStreamsPct: stringToNumber.nullable(),
    youtubeViews: z.number().nullable(),
    youtubeViewsPct: stringToNumber.nullable(),
    // Points
    totalBasePoints: z.number(),
    totalEngagementPoints: z.number(),
    totalPoints: z.number(),
    // History
    totalPointsHistory: z.array(
      z.object({
        date: z.string(),
        total_points: z.number(),
      }),
    ),
  }),
};

export default publicProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input }) => {
    const { logger } = ctx;
    const { lissenArtistId, scArtistId } = input;

    logger.info("Getting FML artist metrics", { lissenArtistId, scArtistId });

    if (scArtistId) {
      const artistMetrics = await db.user.query.userFmlArtistMetrics.findFirst({
        where: eq(userFmlArtistMetrics.scArtistId, scArtistId),
      });

      if (!artistMetrics) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Artist metrics not found",
        });
      }

      return {
        ...artistMetrics,
        artistName: artistMetrics.name,
        artistImage: artistMetrics.image,
      };
    }

    if (lissenArtistId) {
      const artistMapping = await db.user.query.fmlArtistMapping.findFirst({
        where: eq(fmlArtistMapping.lissenArtistId, lissenArtistId),
      });

      if (!artistMapping?.scArtistId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Artist mapping not found",
        });
      }

      const artistMetrics = await db.user.query.userFmlArtistMetrics.findFirst({
        where: eq(userFmlArtistMetrics.scArtistId, artistMapping.scArtistId),
      });

      if (!artistMetrics) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Artist metrics not found",
        });
      }

      return {
        ...artistMetrics,
        artistName: artistMetrics.name,
        artistImage: artistMetrics.image,
      };
    }

    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Either lissenArtistId or scArtistId must be provided",
    });
  });
