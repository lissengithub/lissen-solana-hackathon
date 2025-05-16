import type { Config } from "drizzle-kit";

export default {
  dbCredentials: {
    url: process.env.USER_DB_CONNECTION || "",
  },
  schema: "./src/user/schema/*",
  out: "./src/user/migrations",
  verbose: true,
  dialect: "postgresql",
} satisfies Config;
