import { z } from "zod";
import { albumLibrarySchema } from "./album";
import { playlistLibrarySchema } from "./playlist";
import { artistLibrarySchema } from "./artist";

export const librarySchema = z.discriminatedUnion("type", [
  albumLibrarySchema,
  playlistLibrarySchema,
  artistLibrarySchema,
]);

export type Library = z.infer<typeof librarySchema>;
