import { Sidebar } from "@/components/ui/admin/sidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex w-full overflow-hidden">
      <Sidebar />
      <div className="max-h-screen grow overflow-y-auto">{children}</div>
    </div>
  );
}
