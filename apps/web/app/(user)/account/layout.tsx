import { Sidebar } from "@/components/ui/user/sidebar";

export default function UserAccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full grow flex-row">
      <Sidebar />
      <div className="flex w-full grow flex-col gap-3 p-6">{children}</div>
    </div>
  );
}
