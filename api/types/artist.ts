import { z } from "zod";
import { albumSchema } from "./album";
import { songSchema } from "./song";

export const artistSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  blurhash: z.string().nullable(),
});

export type Artist = z.infer<typeof artistSchema>;

export const artistProfileSchema = z.object({
  albums: z.array(albumSchema),
  blurhash: z.string().nullable(),
  id: z.string(),
  image: z.string().nullable(),
  name: z.string().trim(),
  popularSongs: z.array(songSchema),
});

export type ArtistProfile = z.infer<typeof artistProfileSchema>;

export const searchArtistSchema = artistSchema.extend({
  type: z.literal("artist"),
});

export type SearchArtist = z.infer<typeof searchArtistSchema>;

export const artistLibrarySchema = artistProfileSchema.extend({
  type: z.literal("artist"),
});

export type ArtistLibrary = z.infer<typeof artistLibrarySchema>;
