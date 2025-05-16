import { createTRPCClient } from "@trpc/client";
import { createServerSideHelpers } from "@trpc/react-query/server";
import type { AppRouter } from "@api/router";
import { httpBatchLink } from "@trpc/client";
import { API_URL, transformer } from "./common";

const proxyClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: API_URL,
      transformer,
    }),
  ],
});

export const trpcServer = createServerSideHelpers({
  client: proxyClient,
});
