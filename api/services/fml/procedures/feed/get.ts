import { publicProcedure } from "../../../../trpc";
import { z } from "zod";
import {
  db,
  eq,
  fmlArtistPointsLog,
  fmlLeagueTraits,
  fmlArtistTraits,
  lt,
  desc,
  fmlFeedLikes,
  inArray,
  fmlScrapeArtistContentItemState,
} from "@libs/neon";
import { TRPCError } from "@trpc/server";

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
  likeCount: z.number().nullable().optional(),
  isLiked: z.boolean().nullable().optional(),
  contentLink: z.string().optional(),
  contentType: z.string().optional(),
});

const schema = {
  input: z.object({
    leagueId: z.string(),
    cursor: z.number().optional(),
    limit: z.number().min(1).max(50).default(20),
  }),
  output: z.object({
    items: z.array(feedItemSchema),
    nextPageCursor: z.number().nullish(),
  }),
};

export default publicProcedure
  .input(schema.input)
  .output(schema.output)
  .query(async ({ ctx, input }) => {
    const { logger, uid } = ctx;
    const { leagueId, limit, cursor: cursorValue } = input;

    logger.info(
      `Fetching FML feed items for league ${leagueId}, cursorValue (oldestLogId): ${cursorValue}, limit: ${limit}`,
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
          message: "League trait not found",
        });
      }
      const traitId = leagueTrait.traitId;

      const limitToFetch = limit + 1;

      const orderByCondition = desc(fmlArtistPointsLog.logId);
      let cursorLogIdCondition;

      if (cursorValue) {
        cursorLogIdCondition = lt(fmlArtistPointsLog.logId, cursorValue);
      }

      const rawItemsUnfiltered = await db.catalog
        // eslint-disable-next-line no-restricted-syntax -- Catalog direct access
        .query({ territoryCode: "OVERRIDE" })
        .fmlArtistPointsLog.findMany({
          where: cursorLogIdCondition,
          orderBy: orderByCondition,
          limit: limitToFetch,
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

      const hasMoreOlder = rawItemsUnfiltered.length > limit;
      const pageItems = itemsMatchingTraitWithContent.slice(0, limit);

      // Get the likes for the items
      const logIds = pageItems.map((item) => item.logId);
      const likes = await db.user.query.fmlFeedLikes.findMany({
        where: inArray(fmlFeedLikes.logId, logIds),
        columns: {
          logId: true,
          userId: true,
        },
      });

      const enrichedPageItems = pageItems.map((item) => ({
        ...item,
        likeCount: likes.filter((like) => like.logId === item.logId).length,
        isLiked: likes.some(
          (like) => like.logId === item.logId && like.userId === uid,
        ),
      }));

      let nextPageCursor: number | null = null;
      if (hasMoreOlder && pageItems.length > 0) {
        nextPageCursor = pageItems[pageItems.length - 1].logId;
      }

      logger.info(
        `Returning ${pageItems.length} feed items. NextCursor (for older): ${nextPageCursor}`,
      );

      return {
        items: enrichedPageItems,
        nextPageCursor: nextPageCursor,
      };
    } catch (error) {
      logger.error("Failed to fetch FML feed items", {
        error,
        leagueId,
        cursor: cursorValue,
      });
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch feed items",
        cause: error,
      });
    }
  });
