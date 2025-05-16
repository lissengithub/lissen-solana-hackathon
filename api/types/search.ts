import { z } from "zod";
import { searchArtistSchema } from "./artist";
import { searchAlbumSchema } from "./album";
import { searchSongSchema } from "./song";
import { searchPlaylistSchema } from "./playlist";

export const searchSchema = z.discriminatedUnion("type", [
  searchArtistSchema,
  searchAlbumSchema,
  searchSongSchema,
  searchPlaylistSchema,
]);

export type Search = z.infer<typeof searchSchema>;
