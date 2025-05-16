import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/fields";
export const partnerTokens = pgTable(
  "partner_tokens",
  {
    ...timestamps,
    rightsControllerName: varchar("rights_controller_name", {
      length: 36,
    }).notNull(),
    rightsControllerId: varchar("rights_controller_id", { length: 36 }),
    token: varchar("token", { length: 100 }).notNull(),
  },
  (table) => {
    return {
      partnerTokensId: primaryKey({
        columns: [table.token, table.rightsControllerName],
        name: "partner_tokens_id",
      }),
    };
  },
);
