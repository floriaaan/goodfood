"use client";

import { PromotionCreateEditFormValues } from "@/components/admin/promotion/form";
import { PromotionFormSheetContent } from "@/components/admin/promotion/sheet-content";
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
import { Promotion } from "@/types/promotion";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { MdArrowDropUp, MdCopyAll, MdEdit } from "react-icons/md";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const promotions_columns: ColumnDef<Promotion>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Code
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
  },
  {
    accessorKey: "method",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Méthode
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
  },
  {
    accessorKey: "reduction",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Valeur
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
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
                {"Copier le code promo"}
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
          <PromotionFormSheetContent initialValues={{ ...p } as unknown as PromotionCreateEditFormValues} id={p.id} />
        </Sheet>
      );
    },
  },
];
