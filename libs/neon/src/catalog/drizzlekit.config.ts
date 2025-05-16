import type { Config } from "drizzle-kit";

export default {
  dbCredentials: {
    url: process.env.CATALOG_DB_CONNECTION || "",
  },
  schema: "./src/catalog/schema/*",
  out: "./src/catalog/migrations",
  verbose: true,
  dialect: "postgresql",
} satisfies Config;
