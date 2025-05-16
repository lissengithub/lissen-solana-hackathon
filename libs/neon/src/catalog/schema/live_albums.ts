import {
  varchar,
  integer,
  decimal,
  pgTable,
  index,
  boolean,
} from "drizzle-orm/pg-core";
import { ValidTerritoryCode } from "@libs/utils";
import { timestamps } from "../../utils/fields";
import { relations, sql } from "drizzle-orm";
import { liveSongs } from "./live_songs";

export const liveAlbums = pgTable(
  "live_albums",
  {
    ...timestamps,
    id: varchar("id").primaryKey(),
    title: varchar("title").notNull(),
    advisory: varchar("advisory"),
    image: varchar("image").notNull(),
    blurhash: varchar("blurhash"),
    c_line: varchar("c_line"),
    total_duration: decimal("total_duration"),
    track_count: integer("track_count").notNull(),
    artist_text: varchar("artist_text").notNull(),
    genre_names: varchar("genre_names").array(),
    genre_ids: varchar("genre_ids").array(),
    territories: varchar("territories")
      .array()
      .$type<ValidTerritoryCode[]>()
      .notNull(),
    artist_names: varchar("artist_names").array().notNull(),
    artist_images: varchar("artist_images").array().notNull(),
    artist_ids: varchar("artist_ids").array().notNull(),
    artist_blurhashes: varchar("artist_blurhashes").array(),
    release_date: varchar("release_date"),
    hasPrivateSong: boolean("has_private_song").notNull().default(false),
  },
  (table) => ({
    live_albums_artists_idx: index("live_albums_artists_idx").using(
      "gin",
      table.artist_ids,
    ),
    live_albums_genres_idx: index("live_albums_genres_idx").using(
      "gin",
      table.genre_ids,
    ),
    live_albums_title_idx: index("live_albums_title_idx").using(
      "btree",
      sql`lower(${table.title})`,
    ),
    live_albums_title_gin_idx: index("live_albums_title_gin_idx").using(
      "gin",
      sql`${table.title} gin_trgm_ops`,
    ),
    live_albums_created_at_idx: index("live_albums_created_at_idx").using(
      "btree",
      table.createdAt,
    ),
  }),
);

export const liveAlbumsRelations = relations(liveAlbums, ({ many }) => ({
  songs: many(liveSongs),
}));
