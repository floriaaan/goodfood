"use client";

import { RoleDialogContent } from "@/app/admin/super/dialog-content";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { MdArrowDropUp, MdManageAccounts } from "react-icons/md";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const users_columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Identifiant
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
    cell: ({ getValue }) => {
      const id = (getValue() as User["id"]).split("-");
      return <span className="line-clamp-1 truncate">{id[0] + "-" + id[1] + " ..."}</span>;
    },
  },
  {
    id: "user",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom, prénom
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
    cell: ({ row }) => {
      const u = row.original;

      return (
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-1">
            <strong>{u.lastName}</strong>
            <span>{u.firstName}</span>
          </div>
          {u.email && <span className="text-xs">{u.email}</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rôle
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
    cell: ({ getValue }) => {
      const role = getValue() as User["role"];
      return <span className="line-clamp-1 truncate">{role.label}</span>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const p = row.original;

      return (
        <Dialog>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-y-1 p-2">
              <DropdownMenuItem>
                <DialogTrigger className="inline-flex items-center gap-x-1">
                  <MdManageAccounts className="h-4 w-4 shrink-0" />
                  Modifier le rôle
                </DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <RoleDialogContent user={p} />
        </Dialog>
      );
    },
  },
];
