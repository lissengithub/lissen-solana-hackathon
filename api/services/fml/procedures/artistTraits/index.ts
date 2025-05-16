import { router } from "../../../../trpc";
import getByIds from "./getByIds";

export const artistTraitsRouter = router({
  getByIds,
});
