import { z } from "zod";

export const songSchema = z.object({
  id: z.string(),
  title: z.string(),
  artistDisplayText: z.string(),
  artistNames: z.array(z.string()),
  artistImages: z.array(z.string()),
  albumId: z.string(),
  albumImage: z.string().nullable(),
  albumBlurhash: z.string().nullable(),
  albumTitle: z.string(),
  duration: z.number(),
  urlOnline: z.string().nullable(),
  urlOffline: z.string().nullable(),
  artistIds: z.array(z.string()),
  trackNumber: z.number(),
  private: z.boolean(),
  accessId: z.string().optional(),
  unlocked: z.boolean().optional(),
});

export type Song = z.infer<typeof songSchema>;

export const searchSongSchema = songSchema.extend({
  type: z.literal("song"),
});

export type SearchSong = z.infer<typeof searchSongSchema>;
