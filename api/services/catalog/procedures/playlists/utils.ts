import { db, inArray, liveSongs } from "@libs/neon";
import { ValidTerritoryCode } from "@libs/utils";

export const getUniqueTerritoryCodes = async (
  songIds: string[],
  userTerritoryCode: ValidTerritoryCode,
) => {
  if (songIds.length === 0) {
    return [];
  }

  const songs = await db.catalog
    .query({ territoryCode: userTerritoryCode })
    .liveSongs.findMany({
      where: inArray(liveSongs.id, songIds),
      columns: {
        territories: true,
      },
    });

  const territories = songs
    .flatMap((s) => s.territories)
    .filter((t) => t !== null);

  return [...new Set(territories)];
};
