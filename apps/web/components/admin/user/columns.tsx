"use client";

import { UserActions } from "@/components/admin/user/actions";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { MdArrowDropUp } from "react-icons/md";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const users_columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    id: "name",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
    cell: ({ row }) => {
      const p = row.original as unknown as Omit<User, "firstName" | "lastName"> & {
        firstname: string;
        lastname: string;
      };

      return (
        <strong>
          {p.firstname} {p.lastname}
        </strong>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => {
      const r = getValue() as User["role"];

      return <span>{r.label}</span>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const p = row.original;
      return <UserActions {...p} />;
    },
  },
];
