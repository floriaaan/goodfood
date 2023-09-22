"use client";
import { AuthProvider } from "@/hooks";
import { LocationProvider } from "@/hooks/useLocation";

export const RootProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <LocationProvider>
        <AuthProvider>{children}</AuthProvider>
      </LocationProvider>
    </>
  );
};
