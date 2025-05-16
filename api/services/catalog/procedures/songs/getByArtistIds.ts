import { arrayOverlaps, db, liveSongs } from "@libs/neon";
import { getSongsByIds, GetSongsByIdsAdditionalColumns } from "./get";
import { songSchema } from "../../../../types/song";
import { ValidTerritoryCode } from "@libs/utils";
import { protectedProcedure } from "../../../../trpc";
import { z } from "zod";
import Logger from "@libs/logger";

export const getSongsByArtistIds = async (
  artistIds: string[],
  territoryCode: ValidTerritoryCode,
  uid: string,
  logger: Logger,
  options?: {
    sortBy?: "popularity";
    limit?: number;
    additionalColumns?: GetSongsByIdsAdditionalColumns;
  },
) => {
  if (artistIds.length === 0) return [];
  const songIds = (
    await db.catalog.query({ territoryCode }).liveSongs.findMany({
      where: arrayOverlaps(liveSongs.artist_ids, artistIds),
      columns: {
        id: true,
        ...options?.additionalColumns,
      },
      limit: options?.limit,
    })
  )
    .map((x) => x.id)
    .filter((x) => x !== null);
  return getSongsByIds({
    ids: songIds,
    territoryCode,
    options,
    uid,
    logger,
  });
};

export default protectedProcedure
  .input(z.array(z.string()))
  .output(z.array(songSchema))
  .query(async ({ ctx: { territoryCode, uid, logger }, input }) => {
    return getSongsByArtistIds(input, territoryCode, uid, logger);
  });
