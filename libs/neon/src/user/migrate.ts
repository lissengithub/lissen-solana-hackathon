import { resolve } from "node:path";
import drizzleKitConfig from "./drizzlekit.config";
import runMigration from "../utils/migrate";

export default async () => {
  await runMigration(
    drizzleKitConfig.dbCredentials.url,
    resolve(__dirname, "./migrations"),
  );
};
