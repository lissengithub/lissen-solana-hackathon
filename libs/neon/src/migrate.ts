// import catalogMigration from "./catalog/migrate";
import userMigration from "./user/migrate";

const runMigrations = async () => {
  console.log("Running migrations...");

  // console.log("Migrating catalog...");
  // await catalogMigration();
  // console.log("Catalog migration complete");

  console.log("Migrating user...");
  await userMigration();
  console.log("User migration complete");

  console.log("Migrations complete");
};

runMigrations().catch((error) => {
  console.error(`::migrate - runMigrations error`, error);
});
