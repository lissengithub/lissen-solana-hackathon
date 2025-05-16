import { protectedProcedure } from "../../../../trpc";
import { z } from "zod";
import { db, inArray, liveSongs } from "@libs/neon";
import { ValidTerritoryCode } from "@libs/utils";
import { getSongsByIds } from "./get";
import { songSchema } from "../../../../types/song";
import Logger from "@libs/logger";

export const getSongsByAlbumIds = async (
  albumIds: string[],
  territoryCode: ValidTerritoryCode,
  uid: string,
  logger: Logger,
) => {
  const songIds = (
    await db.catalog.query({ territoryCode }).liveSongs.findMany({
      where: inArray(liveSongs.album_id, albumIds),
      columns: {
        id: true,
      },
    })
  )
    .map((s) => s.id)
    .filter((s) => s !== null);

  return getSongsByIds({
    ids: songIds,
    territoryCode,
    options: { sortBy: "trackNumber" },
    uid,
    logger,
  });
};

export default protectedProcedure
  .input(z.array(z.string()))
  .output(z.array(songSchema))
  .query(async ({ input, ctx: { territoryCode, uid, logger } }) => {
    const songs = await getSongsByAlbumIds(input, territoryCode, uid, logger);
    return songs;
  });
