import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { DrizzleConfig } from "drizzle-orm";

export * from "drizzle-orm";
export * from "./stats";

const customDb = <
  TSchema extends Record<string, unknown> = Record<string, never>,
>(
  url: string,
  config: DrizzleConfig<TSchema>,
): NeonHttpDatabase<TSchema> => {
  return drizzle(neon(url), config);
};

export default customDb;
