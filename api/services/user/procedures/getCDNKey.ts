import { cdn_keys, db, desc } from "@libs/neon";
import { protectedProcedure } from "../../../trpc";

export default protectedProcedure.query(async () => {
  const cdnKeyData = await db.catalog
    // eslint-disable-next-line no-restricted-syntax -- we want all cdn keys, regardless of territory
    .query({ territoryCode: "OVERRIDE" })
    .cdn_keys.findFirst({
      orderBy: desc(cdn_keys.expiry),
    });

  return cdnKeyData;
});
