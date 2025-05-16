import { router } from "../../../../trpc";
import getByArtistId from "./getByArtistId";

export const artistMetricsRouter = router({
  getByArtistId,
});
