"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Address, Restaurant } from "@/types/restaurant";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { MdArrowDropUp, MdCopyAll, MdEdit } from "react-icons/md";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const restaurants_columns: ColumnDef<Restaurant>[] = [
  {
    accessorKey: "name",
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
  },

  {
    accessorKey: "address",
    header: "Adresse",
    cell: ({ getValue }) => {
      const value = getValue() as Address;
      return (
        <span>
          {value.street} {value.zipcode} {value.city}
        </span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
  },
  {
    accessorKey: "openinghoursList",
    header: "Horaires",
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const p = row.original;

      return (
        <Sheet>
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
                {"Copier l'identifiant restaurant"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <SheetTrigger className="inline-flex items-center gap-x-1">
                  <MdEdit className="h-4 w-4 shrink-0" />
                  Modifier/supprimer
                </SheetTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* sheet content */}
        </Sheet>
      );
    },
  },
];
