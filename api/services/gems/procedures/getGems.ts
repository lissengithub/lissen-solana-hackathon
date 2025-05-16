import { z } from "zod";
import { protectedProcedure } from "../../../trpc";
import { getUserGems } from "../helpers/getUserGems";

const schema = {
  output: z.object({
    gems: z.number(),
  }),
};

export default protectedProcedure
  .output(schema.output)
  .query(async ({ ctx: { uid } }) => {
    return getUserGems(uid);
  });
