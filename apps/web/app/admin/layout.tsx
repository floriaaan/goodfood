import { Sidebar } from "@/components/ui/admin/sidebar";
import { ReactNode } from "react";
import { AdminProvider } from "@/hooks/useAdmin";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <div className="inline-flex w-full overflow-hidden">
        <Sidebar />
        <div className="max-h-screen flex-1 grow overflow-y-auto">{children}</div>
      </div>
    </AdminProvider>
  );
}
