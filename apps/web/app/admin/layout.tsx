"use client";

import { Sidebar } from "@/components/admin/sidebar";
import { useAuth } from "@/hooks";
import { AdminProvider } from "@/hooks/useAdmin";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return "Unauthorized";
  if (user.role.code !== "MANAGER" && user.role.code !== "ADMIN") return "Unauthorized";

  return (
    <AdminProvider>
      <div className="inline-flex w-full overflow-hidden">
        <Sidebar />
        <div className="max-h-screen flex-1 grow overflow-y-auto">{children}</div>
      </div>
    </AdminProvider>
  );
}
