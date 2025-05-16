"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, trpc, trpcClient } from "./index";

export default function TRPCProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
