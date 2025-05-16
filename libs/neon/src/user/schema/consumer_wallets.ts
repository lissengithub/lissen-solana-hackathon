import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { timestamps, autoId } from "../../utils/fields";
export const consumerWallets = pgTable("consumer_wallets", {
  ...timestamps,
  ...autoId,
  eoa: varchar("eoa", { length: 42 }).notNull(), // It's a 42 character string
  privateKey: text("private_key").notNull(),
  seedPhrase: text("seed_phrase").notNull(),
});
