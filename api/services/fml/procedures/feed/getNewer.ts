import { publicProcedure } from "../../../../trpc";
import { z } from "zod";
import {
  db,
  eq,
  fmlArtistPointsLog,
  fmlLeagueTraits,
  fmlArtistTraits,
  gt, // For fetching items newer than latestKnownLogId
  desc,
  fmlScrapeArtistContentItemState, // Order by newest first for this query
} from "@libs/neon";
import { TRPCError } from "@trpc/server";

// Schema for a single feed item - consistent with get.ts
const feedItemSchema = z.object({
  logId: z.number(),
  scArtistId: z.string(),
  platformName: z.union([z.literal("instagram"), z.literal("tiktok")]),
  metricType: z.string(),
  platformContentId: z.string().nullable(),
  deltaValue: z.number(),
  pointsAwarded: z.number(),
  scrapeTs: z.string().nullable(),
  createdAt: z.string(),
  profileLink: z.string(),
  artist: z.object({
    scArtistId: z.string(),
    image: z.string().nullable(),
    name: z.string().nullable(),
    instagramHandle: z.string().nullable(),
    tiktokHandle: z.string().nullable(),
  }),
  contentLink: z.string().optional(),
  contentType: z.string().optional(),
});

const schema = {
  input: z.object({
    leagueId: z.string(),
    latestKnownLogId: z.number(), // ID of the newest item client has
    limit: z.number().min(1).max(50).default(10),
  }),
  output: z.object({
    items: z.array(feedItemSchema),
  }),
};

export default publicProcedure
  .input(schema.input)
  .output(schema.output)
  .mutation(async ({ ctx, input }) => {
    const { logger } = ctx;
    const { leagueId, latestKnownLogId, limit } = input;

    logger.info(
      `Fetching newer FML feed items for league ${leagueId}, newer than logId: ${latestKnownLogId}, limit: ${limit}`,
    );

    try {
      const leagueTrait = await db.user.query.fmlLeagueTraits.findFirst({
        where: eq(fmlLeagueTraits.leagueId, leagueId),
        columns: {
          traitId: true,
        },
      });

      if (!leagueTrait) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "League trait not found for getNewer",
        });
      }
      const traitId = leagueTrait.traitId;

      const rawItemsUnfiltered = await db.catalog
        // eslint-disable-next-line no-restricted-syntax -- Catalog direct access
        .query({ territoryCode: "OVERRIDE" })
        .fmlArtistPointsLog.findMany({
          where: gt(fmlArtistPointsLog.logId, latestKnownLogId),
          orderBy: desc(fmlArtistPointsLog.logId), // Get newer items in newest-first order
          limit: limit, // Apply the limit
          with: {
            artist: {
              columns: {
                scArtistId: true,
                image: true,
                name: true,
                instagramHandle: true,
                tiktokHandle: true,
              },
              with: {
                traits: {
                  columns: {
                    traitId: true,
                  },
                  where: eq(fmlArtistTraits.traitId, traitId),
                },
              },
            },
          },
        });

      const itemsMatchingTrait = rawItemsUnfiltered.filter(
        (item) => item.artist?.traits?.length > 0,
      );

      const itemsMatchingTraitWithContent: z.infer<typeof feedItemSchema>[] =
        [];

      for (const item of itemsMatchingTrait) {
        if (item.platformContentId) {
          const content = await db.catalog
            // eslint-disable-next-line no-restricted-syntax -- Catalog direct access
            .query({ territoryCode: "OVERRIDE" })
            .fmlScrapeArtistContentItemState.findFirst({
              where: eq(
                fmlScrapeArtistContentItemState.scArtistId,
                item.artist.scArtistId,
              ),
              orderBy: desc(fmlScrapeArtistContentItemState.scrapeTs),
            });

          itemsMatchingTraitWithContent.push({
            ...item,
            contentLink: content?.extLink,
            contentType: content?.platformContentType,
          });
        } else {
          itemsMatchingTraitWithContent.push(item);
        }
      }

      logger.info(
        `Returning ${itemsMatchingTraitWithContent.length} newer feed items.`,
      );

      return {
        items: itemsMatchingTraitWithContent,
      };
    } catch (error) {
      logger.error("Failed to fetch newer FML feed items", {
        error,
        leagueId,
        latestKnownLogId,
      });
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch newer feed items",
        cause: error,
      });
    }
  });
