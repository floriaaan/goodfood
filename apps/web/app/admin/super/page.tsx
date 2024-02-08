"use client";
import { users_columns } from "@/app/admin/super/columns";
import { DataTable } from "@/components/ui/data-table";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminSuperPage() {
  const { users } = useAdmin();
  return (
    <div className="flex flex-col">
      <h2 className="font-ultrabold inline-flex items-center gap-2 bg-neutral-100 p-2 text-3xl uppercase lg:p-8">
        Gestion des rôles
      </h2>
      <div className="flex w-full gap-4 p-2 lg:p-8">
        <DataTable data={users.sort((a, b) => a.id.localeCompare(b.id))} columns={users_columns} />
      </div>
    </div>
  );
}
