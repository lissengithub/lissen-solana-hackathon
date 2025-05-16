import { z } from "zod";
import { publicProcedure } from "../../../../trpc";
import { db, eq, fmlArtists } from "@libs/neon";
import { TRPCError } from "@trpc/server";

const schema = {
  input: z.object({
    scArtistId: z.string(),
  }),
  output: z.object({
    scArtistId: z.string(),
    name: z.string(),
    image: z.string().nullable(),
    instagramHandle: z.string().nullable().optional(),
    tiktokHandle: z.string().nullable().optional(),
  }),
};

export default publicProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input }) => {
    const { logger } = ctx;
    const { scArtistId } = input;

    logger.info("Getting artist by ID", { scArtistId });

    try {
      const artist = await db.catalog
        // eslint-disable-next-line no-restricted-syntax -- fml artists
        .query({ territoryCode: "OVERRIDE" })
        .fmlArtists.findFirst({
          where: eq(fmlArtists.scArtistId, scArtistId),
          columns: {
            scArtistId: true,
            name: true,
            image: true,
            instagramHandle: true,
            tiktokHandle: true,
          },
        });

      if (!artist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Artist not found",
        });
      }

      return artist;
    } catch (error) {
      logger.error("Error fetching artist by ID", { error, scArtistId });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching artist by ID",
      });
    }
  });
