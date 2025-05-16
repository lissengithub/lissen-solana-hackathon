import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar, boolean } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
import { accesses } from "./accesses";

export const accessCollaborators = pgTable(
  "access_collaborators",
  {
    ...timestamps,
    accessId: varchar("access_id", { length: 36 }).notNull(),
    artistId: varchar("artist_id", { length: 36 }).notNull(),
    accepted: boolean("accepted"),
  },
  (table) => {
    return {
      accessCollaboratorsId: primaryKey({
        columns: [table.accessId, table.artistId],
        name: "access_collaborators_access_id_artist_id",
      }),
    };
  },
);

export const accessCollaboratorsRelations = relations(
  accessCollaborators,
  ({ one }) => ({
    access: one(accesses, {
      fields: [accessCollaborators.accessId],
      references: [accesses.id],
    }),
  }),
);
