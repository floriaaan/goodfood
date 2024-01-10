"use client";
import { AuthNavbar } from "@/components/ui/navbar/auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-col">
      <AuthNavbar />
      {children}
    </div>
  );
}
