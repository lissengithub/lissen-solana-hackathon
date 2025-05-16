export type MinimalGenre = {
  id: string;
  name: string;
};

export type MinimalArtist = {
  id: string;
  image: string | null;
  blurhash: string | null;
  name: string;
};

export type Genre = {
  id: string;
  name: string;
  image: string | null;
  primaryColour: string;
  secondaryColour: string;
  blurhash?: string | null;
};

export type Song = {
  id: string;

  title: string;
  duration: number;

  genres?: MinimalGenre[];

  artistDisplayText: string;

  featuredArtists: MinimalArtist[];
  artists: MinimalArtist[];
  writers: MinimalArtist[];

  album: Omit<Album, "songs" | "artists">;

  created: string;
  updated: string;

  url_offline: string | null;
  url_online: string | null;
};

export type Album = {
  id: string;

  title: string;

  image: string | null;
  blurhash: string | null;

  genres?: MinimalGenre[];

  songs: Song[];

  artistDisplayText: string;
  artists: (MinimalArtist & { role: string })[];

  created: string;
  updated: string;
};

export type Playlist = {
  id: string;
  visibility: "public" | "private";

  title: string;

  songs: Omit<Song, "genre">[];

  user: {
    id: string;
    name: string;
    image: string | null;
    blurhash: string | null;
  };
  genre: {
    id: string;
    name: string;
  } | null;

  //only defined for custom playlists like "liked songs"
  image: string | null;
  blurhash: string | null;

  created: string;
  updated: string;
};

export type Artist = {
  id: string;

  name: string;
  image: string | null;
  blurhash: string | null;
  artworkYOffset: number;

  albums: Album[];
  popularSongs: Song[];

  created: string;
  updated: string;
};

export type Library<T extends "playlist" | "album" | "artist"> =
  T extends "playlist"
    ? Playlist & { type: "playlist" }
    : T extends "album"
      ? Album & { type: "album" }
      : T extends "artist"
        ? Artist & { type: "artist" }
        : never;
