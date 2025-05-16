import { router } from "../../../../trpc";
import getById from "./getById";
import listPaginated from "./listPaginated";

export const artistsRouter = router({
  getById,
  listPaginated,
});
