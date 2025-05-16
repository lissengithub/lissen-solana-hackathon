// This function will return song ids for artists, compositions and recordings
// It will also return song ids for artists seperately, because we need to know this for calculating the share of a artist

import { ValidTerritoryCode } from "@libs/utils";

import { db, arrayOverlaps, liveSongs } from "../index";

// since we dont't have royalties_type of artist in BQ
export const songIdsForEntities = async (
  entities: { entityId: string; entityType: string }[],
  territoryCode: ValidTerritoryCode,
) => {
  const artistIds: string[] = [];

  entities.forEach((entity) => {
    switch (entity.entityType) {
      case "artist":
        artistIds.push(entity.entityId);
        break;
    }
  });

  if (!artistIds.length) {
    return { songIds: [], artistSongIds: [] };
  }

  // Can't use promise.all here, because we need to know the songIds for artists seperately
  const songIds = (
    await db.catalog.query({ territoryCode }).liveSongs.findMany({
      where: arrayOverlaps(liveSongs.artist_ids, artistIds),
      columns: {
        id: true,
      },
    })
  )
    .map((song) => song.id)
    .filter((id) => id !== null);

  return { songIds, artistSongIds: songIds };
};
