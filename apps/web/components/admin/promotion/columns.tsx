"use client";

import { PromotionActions } from "@/components/admin/promotion/actions";
import { cn } from "@/lib/utils";
import { Promotion } from "@/types/promotion";
import { ColumnDef } from "@tanstack/react-table";
import { MdArrowDropUp } from "react-icons/md";

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

      return <PromotionActions {...p} />;
    },
  },
];
