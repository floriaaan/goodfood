import { Sidebar } from "@/components/ui/admin/sidebar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <>
    <Sidebar />
    <div>{children} </div>
    </>
  }
