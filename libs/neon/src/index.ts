import { injectTerritorySafeQuery } from "./utils/query";
import catalogDb from "./catalog";
export * from "./catalog";
import userDb from "./user";
export * from "./user";
export * from "drizzle-orm";
export { type OverridableTerritoryCode } from "./utils/queryModifiers";

export const db = {
  catalog: injectTerritorySafeQuery(catalogDb),
  user: userDb,
};
