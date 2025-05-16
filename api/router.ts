import { catalogRouter } from "./services/catalog";
import { gemsRouter } from "./services/gems";
import { userRouter } from "./services/user";
import { websiteRouter } from "./services/website";
import { router } from "./trpc";
import { fmlRouter } from "./services/fml";
import { solRouter } from "./services/sol";

const appRouter = router({
  catalog: catalogRouter,
  gems: gemsRouter,
  user: userRouter,
  website: websiteRouter,
  fml: fmlRouter,
  sol: solRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
