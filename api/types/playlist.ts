import { z } from "zod";
import { songSchema } from "./song";

export const playlistSchema = z.object({
  blurhash: z.string().nullable(),
  hasCustomImage: z.boolean(),
  id: z.string(),
  images: z.array(z.string()).nullable(),
  title: z.string(),
  visibility: z.enum(["public", "private"]),
  user: z.object({
    id: z.string(),
    name: z.string(),
  }),
  songs: z.array(
    z.object({
      id: z.string(),
    }),
  ),
  hasPrivateSong: z.boolean(),
});

export type Playlist = z.infer<typeof playlistSchema>;

export const playlistWithSongsSchema = playlistSchema.extend({
  songs: z.array(songSchema),
});

export type PlaylistWithSongs = z.infer<typeof playlistWithSongsSchema>;

export const searchPlaylistSchema = playlistSchema.extend({
  type: z.literal("playlist"),
});

export type SearchPlaylist = z.infer<typeof searchPlaylistSchema>;

export const playlistLibrarySchema = playlistWithSongsSchema.extend({
  type: z.literal("playlist"),
});

export type PlaylistLibrary = z.infer<typeof playlistLibrarySchema>;
