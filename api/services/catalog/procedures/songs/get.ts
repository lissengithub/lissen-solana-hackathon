import {
  // accessTypeSong,
  // accessTypeSongOwners,
  asc,
  db,
  desc,
  eq,
  inArray,
  liveSongs,
  OverridableTerritoryCode,
  solUnlockedSongs,
} from "@libs/neon";
import { protectedProcedure } from "../../../../trpc";
import { z } from "zod";
import _ from "lodash";
import { Song, songSchema } from "../../../../types/song";
import type { LiveSongsSelect } from "@libs/neon";
import Logger from "@libs/logger";

type BaseSong = Song & {
  isrc?: string;
  // These are added for backwards compatibility
  artistBlurhashes: string[];
  featuredArtistIds: string[];
};

type SongWithAdditionalColumns<
  T extends Partial<Record<keyof LiveSongsSelect, true>> | undefined,
> = T extends undefined
  ? BaseSong
  : BaseSong & {
      [K in keyof T]: K extends keyof LiveSongsSelect
        ? LiveSongsSelect[K]
        : never;
    };

type BaseColumnKeys =
  | "id"
  | "title"
  | "artist_text"
  | "artist_names"
  | "artist_images"
  | "album_id"
  | "album_image"
  | "album_blurhash"
  | "album_title"
  | "duration"
  | "url_online"
  | "url_offline"
  | "artist_ids"
  | "track_number"
  | "artist_blurhashes"
  | "featured_artist_ids"
  | "private";

type AdditionalColumnKeys = Exclude<keyof LiveSongsSelect, BaseColumnKeys>;

export type GetSongsByIdsAdditionalColumns = {
  [K in AdditionalColumnKeys]?: true;
};

type SongFromDB = {
  id: string;
  title: string;
  album_id: string;
  artist_text: string;
  artist_names: string[];
  artist_images: string[];
  album_image: string;
  album_blurhash: string | null;
  duration: string | null;
  url_online: string;
  url_offline: string;
  artist_ids: string[];
  album_title: string;
  track_number: number;
  artist_blurhashes: string[] | null;
  featured_artist_ids: string[] | null;
  private: boolean;
} & Partial<Record<AdditionalColumnKeys, unknown>>;

interface GetSongsByIdsOptions<T extends GetSongsByIdsAdditionalColumns> {
  additionalColumns?: T;
  limit?: number;
  sortBy?: "popularity" | "trackNumber";
  uniqueSongsOnly?: boolean;
}

// type SongWithAccess<T extends GetSongsByIdsAdditionalColumns> =
//   SongWithAdditionalColumns<T> & {
//     accessId?: string;
//   };

type SongWithUnlocked<T extends GetSongsByIdsAdditionalColumns> =
  SongWithAdditionalColumns<T> & {
    unlocked?: boolean;
  };

export const processSongs = <T extends GetSongsByIdsAdditionalColumns>(
  songs: SongFromDB[],
  options?: GetSongsByIdsOptions<T>,
) => {
  const songsToReturn = songs.map((song) => {
    const baseSong: BaseSong = {
      id: song.id,
      title: song.title,
      albumId: song.album_id,
      artistDisplayText: song.artist_text,
      artistNames: song.artist_names,
      artistImages: song.artist_images,
      albumImage: song.album_image,
      albumBlurhash: song.album_blurhash,
      duration: parseFloat(song.duration || "0"),
      urlOnline: song.url_online,
      urlOffline: song.url_offline,
      artistIds: song.artist_ids,
      albumTitle: song.album_title,
      trackNumber: song.track_number,
      artistBlurhashes: song.artist_blurhashes || [],
      featuredArtistIds: song.featured_artist_ids || [],
      isrc: song.isrc as string | undefined,
      private: song.private,
    };

    const additionalData = options?.additionalColumns
      ? Object.keys(options.additionalColumns).reduce(
          (acc, key) => {
            if (key in song) {
              (acc as any)[key] = song[key as keyof typeof song];
            }
            return acc;
          },
          {} as Record<string, unknown>,
        )
      : {};

    return { ...baseSong, ...additionalData } as SongWithAdditionalColumns<T>;
  });

  if (options?.uniqueSongsOnly) {
    return _.uniqWith(
      songsToReturn,
      (songA, songB) =>
        songA.id === songB.id ||
        (!!songA.isrc && songA.isrc === songB.isrc) ||
        (songA.title === songB.title &&
          _.isEqual(songA.artistIds, songB.artistIds)),
    );
  }

  const uniqueSongs = _.uniqBy(songsToReturn, "id");
  return uniqueSongs;
};
//FIXME: commented out for solana demo
// const handlePrivateSongs = async <T extends GetSongsByIdsAdditionalColumns>(
//   songs: SongWithAdditionalColumns<T>[],
//   uid: string | "admin",
// ): Promise<SongWithAccess<T>[]> => {
//   const privateSongIds = songs
//     .filter((song) => song.private)
//     .map((song) => song.id);
//   const accessTypeSongs = await db.user.query.accessTypeSong.findMany({
//     where: inArray(accessTypeSong.songId, privateSongIds),
//     columns: {
//       id: true,
//       accessId: true,
//       songId: true,
//     },
//     with: {
//       accessTypeSongOwners: {
//         where: eq(accessTypeSongOwners.userId, uid),
//       },
//       access: {
//         columns: {
//           id: true,
//           isBonusOnly: true,
//         },
//       },
//     },
//   });

//   const newSongs = songs.map((song) => {
//     const isPrivate = song.private;
//     if (isPrivate) {
//       const accessTypeDetails = accessTypeSongs.find(
//         (access) => access.songId === song.id,
//       );
//       if (!accessTypeDetails) {
//         return null;
//       }

//       return {
//         ...song,
//         accessId: accessTypeDetails.access.id,
//       } as SongWithAccess<T>;
//     }
//     return song as SongWithAccess<T>;
//   });

//   return newSongs.filter((song) => song !== null);
// };
const handlePrivateSongsSolana = async <
  T extends GetSongsByIdsAdditionalColumns,
>(
  songs: SongWithAdditionalColumns<T>[],
  uid: string,
) => {
  const unlockedSongs = await db.user.query.solUnlockedSongs.findMany({
    where: eq(solUnlockedSongs.userId, uid),
  });

  const unlockedSongIds = unlockedSongs.map((song) => song.songId);

  const newSongs = songs.map((song) => {
    if (unlockedSongIds.includes(song.id)) {
      return { ...song, unlocked: true };
    }
    return song;
  });

  return newSongs as SongWithUnlocked<T>[];
};
export const getSongsByIds = async <T extends GetSongsByIdsAdditionalColumns>({
  ids,
  territoryCode,
  options,
  logger,
  uid,
}: {
  ids: string[];
  territoryCode: OverridableTerritoryCode;
  options?: GetSongsByIdsOptions<T>;
  logger: Logger;
  uid: string | "admin";
}): Promise<SongWithUnlocked<T>[]> => {
  const orderBy =
    options?.sortBy === "popularity"
      ? desc(liveSongs.spotify_popularity)
      : options?.sortBy === "trackNumber"
        ? asc(liveSongs.track_number)
        : undefined;

  const songs = await db.catalog.query({ territoryCode }).liveSongs.findMany({
    where: inArray(liveSongs.id, ids),
    limit: options?.limit,
    columns: {
      id: true,
      title: true,
      artist_text: true,
      artist_names: true,
      artist_images: true,
      artist_blurhashes: true,
      featured_artist_ids: true,
      album_id: true,
      album_image: true,
      album_blurhash: true,
      album_title: true,
      duration: true,
      url_online: true,
      url_offline: true,
      artist_ids: true,
      track_number: true,
      private: true,
      isrc: options?.uniqueSongsOnly ? true : undefined,
      ...options?.additionalColumns,
    },
    orderBy,
  });

  if (songs.length !== ids.length) {
    logger.addMeta({
      songIds: ids
        .map((id) =>
          songs.find((song) => song.id === id) === undefined ? id : undefined,
        )
        .filter((songId) => songId !== undefined),
    });
    logger.error("getSongsByIds: Some song ids were not found");
  }

  let processedSongs: SongWithAdditionalColumns<T>[] = [];
  if (orderBy) {
    processedSongs = processSongs(songs, options);
  }

  const orderedSongs = ids
    .map((id) => songs.find((song) => song.id === id))
    .filter((song) => song !== undefined);

  processedSongs = processSongs(orderedSongs, options);

  return handlePrivateSongsSolana(processedSongs, uid);
  // FIXME: commented out for solana demo
  // return handlePrivateSongs(processedSongs, uid);
};

export default protectedProcedure
  .input(z.array(z.string()).min(1))
  .output(z.array(songSchema))
  .query(async ({ ctx: { territoryCode, uid, logger }, input }) => {
    return getSongsByIds({ ids: input, territoryCode, uid, logger });
  });
