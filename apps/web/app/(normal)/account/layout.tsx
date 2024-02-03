"use client";
import { Sidebar } from "@/components/ui/user/sidebar";
import { useAuth } from "@/hooks";

export default function UserAccountLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return "Not authenticated";

  return (
    <>
      <div className="mx-auto flex h-full w-full grow flex-col gap-2 px-2 pt-2 lg:max-w-7xl lg:flex-row lg:gap-8 lg:px-8 lg:pt-4">
        <Sidebar />
        <div className="flex w-full grow flex-col gap-3 overflow-x-auto pb-6 pt-4">{children}</div>
      </div>
    </>
  );
}
