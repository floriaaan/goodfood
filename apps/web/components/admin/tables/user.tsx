"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { MdArrowDropUp, MdCopyAll } from "react-icons/md";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const users_columns: ColumnDef<User>[] = [
  {
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
      const p = row.original;

      return (
        <span>
          {p.firstName} {p.lastName}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const p = row.original;

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col gap-y-1 p-2">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(p.id)}>
              <MdCopyAll className="h-4 w-4 shrink-0" />
              {"Copier l'identifiant utilisateur"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
