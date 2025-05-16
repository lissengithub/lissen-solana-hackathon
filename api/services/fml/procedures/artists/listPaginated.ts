import { z } from "zod";
import { publicProcedure } from "../../../../trpc";
import {
  db,
  eq,
  fmlArtists,
  fmlArtistTraits,
  fmlLeagueTraits,
  inArray,
  sql,
  and,
} from "@libs/neon";
import { TRPCError } from "@trpc/server";

const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

const schema = {
  input: z.object({
    cursor: z.number().default(DEFAULT_OFFSET),
    limit: z.number().optional().default(DEFAULT_LIMIT),
    searchTerm: z.string().optional(),
    leagueId: z.string().optional(),
  }),
  output: z.object({
    data: z.array(
      z.object({
        scArtistId: z.string(),
        artistName: z.string(),
        artistImage: z.string().nullable(),
      }),
    ),
    nextCursor: z.number().optional(),
  }),
};

export default publicProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input }) => {
    const { logger } = ctx;
    const { searchTerm, leagueId } = input;
    const limit = input.limit ?? DEFAULT_LIMIT;
    const offset = input.cursor ?? DEFAULT_OFFSET;

    try {
      logger.info("Listing artists with pagination", {
        offset,
        limit,
        searchTerm,
        leagueId,
      });

      let leagueTraitIds: string[] = [];

      if (leagueId) {
        leagueTraitIds = (
          await db.user.query.fmlLeagueTraits.findMany({
            where: eq(fmlLeagueTraits.leagueId, leagueId),
            columns: {
              traitId: true,
            },
          })
        ).map((trait) => trait.traitId);
        logger.info("League trait ids", { leagueTraitIds });
      }

      const whereClauses = [];

      if (leagueTraitIds.length > 0) {
        whereClauses.push(inArray(fmlArtistTraits.traitId, leagueTraitIds));
      }

      if (searchTerm) {
        whereClauses.push(sql`${fmlArtists.name} ILIKE ${searchTerm + "%"}`);
      }

      const artists = await db.catalog
        .select({
          scArtistId: fmlArtists.scArtistId,
          artistName: fmlArtists.name,
          artistImage: fmlArtists.image,
        })
        .from(fmlArtists)
        .innerJoin(
          fmlArtistTraits,
          eq(fmlArtists.scArtistId, fmlArtistTraits.scArtistId),
        )
        .where(and(...whereClauses))
        .limit(limit)
        .offset(offset);

      return {
        data: artists,
        nextCursor: artists.length < limit ? undefined : offset + limit,
      };
    } catch (error) {
      logger.error("Error listing artists", { error });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error listing artists",
      });
    }
  });
