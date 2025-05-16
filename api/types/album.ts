import { z } from "zod";
import { songSchema } from "./song";

export const albumSchema = z.object({
  id: z.string(),
  title: z.string(),
  artistDisplayText: z.string().trim(),
  image: z.string().nullable(),
  blurhash: z.string().nullable(),
  artistIds: z.array(z.string()),
  releaseDate: z.string().nullable(),
  hasPrivateSong: z.boolean(),
});

export type Album = z.infer<typeof albumSchema>;

export const albumWithSongsSchema = albumSchema.extend({
  songs: z.array(
    songSchema.pick({
      artistDisplayText: true,
      artistIds: true,
      duration: true,
      id: true,
      title: true,
      urlOnline: true,
      urlOffline: true,
    }),
  ),
});

export type AlbumWithSongs = z.infer<typeof albumWithSongsSchema>;

export const searchAlbumSchema = albumSchema.extend({
  type: z.literal("album"),
});

export type SearchAlbum = z.infer<typeof searchAlbumSchema>;

export const albumLibrarySchema = albumWithSongsSchema.extend({
  type: z.literal("album"),
});

export type AlbumLibrary = z.infer<typeof albumLibrarySchema>;
