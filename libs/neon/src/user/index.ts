import dbClient from "../utils/dbClient";
import drizzleKitConfig from "./drizzlekit.config";
import * as schema from "./schema";
export * from "./schema";

const db = dbClient(drizzleKitConfig.dbCredentials.url, {
  schema: { ...schema },
});

export default db;
