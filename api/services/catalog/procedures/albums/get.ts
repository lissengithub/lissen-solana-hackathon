import { z } from "zod";
import { protectedProcedure } from "../../../../trpc";
import { db, inArray, liveAlbums, OverridableTerritoryCode } from "@libs/neon";
import { albumSchema } from "../../../../types/album";

export const getAlbumsById = async (
  ids: string[],
  territoryCode: OverridableTerritoryCode,
) => {
  if (ids.length === 0) return [];
  const albumsData = await db.catalog
    .query({ territoryCode })
    .liveAlbums.findMany({
      where: inArray(liveAlbums.id, ids),
      columns: {
        id: true,
        title: true,
        image: true,
        blurhash: true,
        artist_text: true,
        artist_ids: true,
        release_date: true,
        hasPrivateSong: true,
      },
    });

  return albumsData.map((x) => ({
    id: x.id || "",
    title: x.title || "",
    artistDisplayText: x.artist_text?.trim() || "",
    image: x.image,
    blurhash: x.blurhash,
    artistIds: x.artist_ids || [],
    releaseDate: x.release_date,
    hasPrivateSong: x.hasPrivateSong,
  }));
};

export default protectedProcedure
  .input(z.array(z.string()))
  .output(z.array(albumSchema))
  .query(async ({ ctx: { territoryCode, logger }, input }) => {
    if (input.length === 0) {
      return [];
    }

    const albums = await getAlbumsById(input, territoryCode);

    if (albums.length === 0) {
      logger.error(`no_albums_found: ${input.join(", ")}`);
    }

    return albums;
  });
