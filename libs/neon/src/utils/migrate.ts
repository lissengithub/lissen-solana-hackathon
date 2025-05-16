import { migrate } from "drizzle-orm/postgres-js/migrator";
import { resolve } from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const runMigration = async (url: string, migrationsFolder: string) => {
  const migrationClient = postgres(url, {
    max: 1,
    debug(_, query, parameters, paramTypes) {
      console.log(query);
      if (parameters.length) {
        console.log({ parameters, paramTypes });
      }
    },
  });
  await migrate(drizzle(migrationClient), {
    migrationsFolder: resolve(__dirname, migrationsFolder),
  });
  await migrationClient.end();
};

export default runMigration;
