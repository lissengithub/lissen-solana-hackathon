import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "../../utils/fields";
import { playlists } from "./playlists";

export const onboardingPlaylists = pgTable("onboarding_playlists", {
  ...timestamps,
  active: boolean("active").notNull().default(false),
  playlistId: varchar("playlist_id", { length: 36 }).primaryKey().notNull(),
});

export const onboardingPlaylistsRelations = relations(
  onboardingPlaylists,
  ({ one }) => ({
    playlist: one(playlists, {
      fields: [onboardingPlaylists.playlistId],
      references: [playlists.id],
    }),
  }),
);
