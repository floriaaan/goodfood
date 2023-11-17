import { Sidebar } from "@/components/ui/user/sidebar";

export default function UserAccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full grow flex-col lg:flex-row">
      <Sidebar />
      <div className="flex w-full grow flex-col gap-3 px-6 pb-6 pt-4">{children}</div>
    </div>
  );
}
