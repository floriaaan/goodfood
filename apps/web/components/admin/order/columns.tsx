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
import { Sheet } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DeliveryType, Order } from "@/types/order";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { MdArrowDropUp, MdCopyAll } from "react-icons/md";
import { toPrice } from "@/lib/product/toPrice";
import { format } from "date-fns";

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
      const user = getValue() as Order["user"];

      return (
        <span>
          {user.firstName} {user.lastName}
        </span>
      );
    },
  },
  {
    accessorKey: "deliveryType",
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
    cell: ({ getValue }) => {
      const deliveryType = getValue() as Order["deliveryType"];
      return <span>{deliveryType === DeliveryType.DELIVERY ? "Livraison" : "Emporter"}</span>;
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
          {toPrice(p.total)} - {p.status}
        </span>
      );
    },
  },
  {
    accessorKey: "delivery",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
    cell: ({ getValue }) => {
      const d = getValue() as Order["delivery"];
      return <span>{format(new Date(d.eta), "eeee d MMMM yyyy à HH:mm")}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row, getValue }) => {
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
            </DropdownMenuContent>
          </DropdownMenu>
          <OrderFormSheetContent initialValues={{ ...o } as unknown as OrderCreateEditFormValues} id={o.id} />
        </Sheet>
      );
    },
  },
];
