import { varchar, boolean, pgTable, bigint, index } from "drizzle-orm/pg-core";
import { ValidTerritoryCode } from "@libs/utils";
import { timestamps } from "../../utils/fields";
import { relations, sql } from "drizzle-orm";
import { liveArtistCatalogCoverage } from "./live_artist_catalog_coverage";

export const liveArtists = pgTable(
  "live_artists",
  {
    ...timestamps,
    id: varchar("id").primaryKey(),
    name: varchar("name").notNull(),
    blurhash: varchar("blurhash"),
    image: varchar("image").notNull(),
    is_featured_only: boolean("is_featured_only").notNull(),
    genre_ids: varchar("genre_ids").array().notNull(),
    genre_names: varchar("genre_names").array().notNull(),
    territories: varchar("territories")
      .array()
      .$type<ValidTerritoryCode[]>()
      .notNull(),
    has_profile_image: boolean("has_profile_image"),
    country_code: varchar("country_code"),
    ext_followers: bigint("ext_followers", { mode: "number" }),
    ext_streams: bigint("ext_streams", { mode: "number" }),
  },
  (table) => ({
    live_artists_name_idx: index("live_artists_name_idx").using(
      "btree",
      sql`lower(${table.name})`,
    ),
    live_artists_name_gin_idx: index("live_artists_name_gin_idx").using(
      "gin",
      sql`${table.name} gin_trgm_ops`,
    ),
  }),
);

export const liveArtistRelations = relations(liveArtists, ({ one }) => ({
  catalogCoverage: one(liveArtistCatalogCoverage, {
    fields: [liveArtists.id],
    references: [liveArtistCatalogCoverage.id],
  }),
}));
