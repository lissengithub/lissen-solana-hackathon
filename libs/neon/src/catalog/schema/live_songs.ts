import {
  varchar,
  boolean,
  integer,
  decimal,
  pgTable,
  jsonb,
  bigint,
  index,
} from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { ValidTerritoryCode } from "@libs/utils";
import { relations, sql } from "drizzle-orm";
import { liveAlbums } from "./live_albums";

export type Creator = {
  creator_name: string;
  creator_image: string;
  creator_blurhash: string;
  has_profile_image: boolean;
  role: string;
};

export const liveSongs = pgTable(
  "live_songs",
  {
    ...timestamps,
    id: varchar("id").primaryKey(),
    title: varchar("title").notNull(),
    active: boolean("active").notNull(),
    visible: boolean("visible").notNull(),
    territories: varchar("territories")
      .array()
      .$type<ValidTerritoryCode[]>()
      .notNull(),
    spotify_popularity: integer("spotify_popularity"),
    url_online: varchar("url_online").notNull(),
    url_offline: varchar("url_offline").notNull(),
    duration: decimal("duration").notNull(),
    track_number: integer("track_number").notNull(),
    genre_id: varchar("genre_id"),
    genre_name: varchar("genre_name"),
    album_blurhash: varchar("album_blurhash"),
    album_title: varchar("album_title").notNull(),
    album_id: varchar("album_id").notNull(),
    album_image: varchar("album_image").notNull(),
    artist_ids: varchar("artist_ids").array().notNull(),
    featured_artist_ids: varchar("featured_artist_ids").array(),
    artist_text: varchar("artist_text").notNull(),
    artist_blurhashes: varchar("artist_blurhashes").array(),
    artist_images: varchar("artist_images").array().notNull(),
    artist_names: varchar("artist_names").array().notNull(),
    creators: jsonb("creators").$type<Creator[]>(),
    audio_mode: decimal("audio_mode"),
    audio_timesignature: decimal("audio_timesignature"),
    audio_acousticness: decimal("audio_acousticness"),
    audio_liveness: decimal("audio_liveness"),
    audio_danceability: decimal("audio_danceability"),
    audio_instrumentalness: decimal("audio_instrumentalness"),
    audio_tempo: decimal("audio_tempo"),
    audio_energy: decimal("audio_energy"),
    audio_speechiness: decimal("audio_speechiness"),
    audio_key: decimal("audio_key"),
    audio_loudness: decimal("audio_loudness"),
    audio_valence: decimal("audio_valence"),
    isrc: varchar("isrc"),
    release_date: varchar("release_date"),
    language: varchar("language"),
    rights_controller_ids: varchar("rights_controller_ids").array(),
    ext_streams: bigint("ext_streams", { mode: "number" }),
    private: boolean("private").notNull().default(false),
  },
  (table) => ({
    live_songs_albums_idx: index("live_songs_albums_idx").using(
      "btree",
      table.album_id,
    ),
    live_songs_artists_idx: index("live_songs_artists_idx").using(
      "gin",
      table.artist_ids,
    ),
    live_songs_title_idx: index("live_songs_title_idx").using(
      "btree",
      sql`lower(${table.title})`,
    ),
    live_songs_title_artist_text_gin_idx: index(
      "live_songs_title_artist_text_gin_idx",
    ).using(
      "gin",
      sql`(${table.title} || ' ' || ${table.artist_text}) gin_trgm_ops`,
    ),
    live_songs_artist_text_title_gin_idx: index(
      "live_songs_artist_text_title_gin_idx",
    ).using(
      "gin",
      sql`(${table.artist_text} || ' ' || ${table.title}) gin_trgm_ops`,
    ),
    live_songs_genre_idx: index("live_songs_genre_idx").using(
      "btree",
      table.genre_id,
    ),
    live_songs_popularity_idx: index("live_songs_popularity_idx").using(
      "btree",
      table.spotify_popularity,
    ),
  }),
);

export const liveSongsRelations = relations(liveSongs, ({ one }) => ({
  album: one(liveAlbums, {
    fields: [liveSongs.album_id],
    references: [liveAlbums.id],
  }),
}));

export type LiveSongsSelect = typeof liveSongs.$inferSelect;
