"use client";

import { OrderCreateEditFormValues } from "@/components/admin/order/form";
import { OrderFormSheetContent } from "@/components/admin/order/sheet-content";
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
import { Order } from "@/types/order";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { MdArrowDropUp, MdCopyAll, MdEdit } from "react-icons/md";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const orders_columns: ColumnDef<Order>[] = [
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
    cell: ({ getValue }) => {
      const p = getValue() as Order["user"];

      return (
        <span>
          {p.first_name} {p.last_name}
        </span>
      );
    },
  },
  {
    accessorKey: "delivery_type",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type de livraison
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
  },
  {
    accessorKey: "payment",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Paiement
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
    cell: ({ getValue }) => {
      const p = getValue() as Order["payment"];

      return (
        <span>
          {p.total} - {p.status}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const o = row.original;

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(o.id)}>
                <MdCopyAll className="h-4 w-4 shrink-0" />
                {"Copier l'identifiant commande"}
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
          <OrderFormSheetContent initialValues={{ ...o } as unknown as OrderCreateEditFormValues} id={o.id} />
        </Sheet>
      );
    },
  },
];
