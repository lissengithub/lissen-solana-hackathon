import Logger from "@libs/logger";
import { asc, db, inArray, playlists, playlistsSongs } from "@libs/neon";
import { getSongsByIds } from "./get";
import { songSchema } from "../../../../types/song";
import { getTodaysTopHitsId, ValidTerritoryCode } from "@libs/utils";
import { protectedProcedure } from "../../../../trpc";
import { z } from "zod";

export const getSongsByPlaylistIds = async (
  playlistIds: string[],
  userId: string,
  territoryCode: ValidTerritoryCode,
  logger: Logger,
) => {
  const todaysTopHitsId = getTodaysTopHitsId(territoryCode);

  const adjustedPlaylistIds = playlistIds.filter(
    (id) => id !== todaysTopHitsId,
  );

  const playlistsInDb = await db.user.query.playlists.findMany({
    where: inArray(playlists.id, adjustedPlaylistIds),
    columns: {
      id: true,
    },
    with: {
      playlistSongs: {
        orderBy: asc(playlistsSongs.createdAt),
      },
    },
  });

  const playlistSongs = playlistsInDb.flatMap((x) => x.playlistSongs);
  const allSongIds = playlistSongs.map((x) => x.songId);

  const allSongs = await getSongsByIds({
    ids: allSongIds,
    territoryCode,
    uid: userId,
    logger,
  });

  const songsSorted = allSongs.sort(
    (a, b) =>
      playlistSongs.findIndex((x) => x.songId === a.id) -
      playlistSongs.findIndex((x) => x.songId === b.id),
  );

  return songsSorted;
};

export default protectedProcedure
  .input(z.array(z.string()))
  .output(z.array(songSchema))
  .query(async ({ ctx: { logger, territoryCode, uid: userId }, input }) => {
    return getSongsByPlaylistIds(input, userId, territoryCode, logger);
  });
