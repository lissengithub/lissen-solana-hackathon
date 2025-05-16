import { z } from "zod";
import { protectedProcedure } from "../../../../trpc";
import { getAlbumsById } from "../albums/get";
import { albumSchema } from "../../../../types/album";
import { ValidTerritoryCode } from "@libs/utils";
import { arrayOverlaps, db, liveAlbums } from "@libs/neon";

export const getAlbumsByArtistIds = async (
  artistIds: string[],
  territoryCode: ValidTerritoryCode,
  options?: {
    limit?: number;
  },
) => {
  if (artistIds.length === 0) return [];
  const albumIds = (
    await db.catalog.query({ territoryCode }).liveAlbums.findMany({
      where: arrayOverlaps(liveAlbums.artist_ids, artistIds),
      columns: {
        id: true,
      },
      limit: options?.limit,
    })
  )
    .map((x) => x.id)
    .filter((x) => x !== null);

  return getAlbumsById(albumIds, territoryCode);
};

export default protectedProcedure
  .input(z.string())
  .output(z.array(albumSchema))
  .query(async ({ ctx: { territoryCode }, input }) => {
    return getAlbumsByArtistIds([input], territoryCode);
  });
