import { pgTable, varchar } from "drizzle-orm/pg-core";

export const solMaster = pgTable("sol_master", {
  publicKey: varchar("public_key").notNull(),
  secretKey: varchar("secret_key").notNull(),
  lissenGemMintAddress: varchar("lissen_gem_mint_address").notNull(),
  lissenGemWalletAddress: varchar("lissen_gem_wallet_address").notNull(),
});
