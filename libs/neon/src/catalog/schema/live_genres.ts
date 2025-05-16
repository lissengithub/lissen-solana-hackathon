import { varchar, pgTable } from "drizzle-orm/pg-core";
import { ValidTerritoryCode } from "@libs/utils";
import { timestamps } from "../../utils/fields";

export const liveGenres = pgTable("live_genres", {
  ...timestamps,
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  image: varchar("image"),
  blurhash: varchar("blurhash"),
  primary_colour: varchar("primary_colour"),
  secondary_colour: varchar("secondary_colour"),
  territories: varchar("territories")
    .array()
    .$type<ValidTerritoryCode[]>()
    .notNull(),
});
