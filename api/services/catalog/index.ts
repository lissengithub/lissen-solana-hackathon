import { router } from "../../trpc";
import getAlbums from "./procedures/albums/get";
import getSongs from "./procedures/songs/get";
import getSongsByAlbumIds from "./procedures/songs/getByAlbumIds";
import getSongsByArtistIds from "./procedures/songs/getByArtistIds";
import getSongsByPlaylistIds from "./procedures/songs/getByPlaylistIds";

export const catalogRouter = router({
  albums: {
    get: getAlbums,
  },
  songs: {
    get: getSongs,
    getByAlbumIds: getSongsByAlbumIds,
    getByPlaylistIds: getSongsByPlaylistIds,
    getByArtistIds: getSongsByArtistIds,
  },
});
