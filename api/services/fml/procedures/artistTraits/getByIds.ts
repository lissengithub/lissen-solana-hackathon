import { z } from "zod";
import { protectedProcedure } from "../../../../trpc";
import { db, fmlArtistTraits, inArray } from "@libs/neon";

const schema = {
  input: z.object({
    artistIds: z.array(z.string()),
  }),
  output: z.array(
    z.object({
      artistId: z.string(),
      traitId: z.string(),
    }),
  ),
};

export default protectedProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input }) => {
    const { logger } = ctx;
    const { artistIds } = input;

    logger.info("Fetching artist traits", { artistIds });

    if (!artistIds.length) {
      return [];
    }

    // Simple direct query with OVERRIDE territory
    const traits = await db.catalog
      // eslint-disable-next-line no-restricted-syntax -- artist traits
      .query({ territoryCode: "OVERRIDE" })
      .fmlArtistTraits.findMany({
        where: inArray(fmlArtistTraits.scArtistId, artistIds),
        columns: {
          scArtistId: true,
          traitId: true,
        },
      });

    // Map to the expected output format
    return traits.map((trait) => ({
      artistId: trait.scArtistId,
      traitId: trait.traitId,
    }));
  });
