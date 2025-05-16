import type { AppRouter } from "@api/router";
import {
  createTRPCQueryUtils,
  createTRPCReact,
  inferReactQueryProcedureOptions,
} from "@trpc/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";
import { inferRouterOutputs } from "@trpc/server";
import { API_URL, transformer } from "./common";
import { auth } from "@/lib/firebase/config";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: () => true,
    }),
    httpBatchLink({
      url: API_URL,
      transformer,
      async headers() {
        if (!auth.currentUser) {
          return {};
        }
        const token = await auth.currentUser.getIdToken();
        return token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};
      },
    }),
  ],
});

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {},
  },
});

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;

export const trpcUtils = createTRPCQueryUtils({
  queryClient,
  client: trpcClient,
});
