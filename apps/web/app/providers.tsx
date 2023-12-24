"use client";
import { AuthProvider } from "@/hooks";
import { LocationProvider } from "@/hooks/useLocation";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const RootProviders = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LocationProvider>
          <AuthProvider>{children}</AuthProvider>
        </LocationProvider>
      </QueryClientProvider>
    </>
  );
};
