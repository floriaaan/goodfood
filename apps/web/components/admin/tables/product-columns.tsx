"use client";

import { ProductCreateEditFormValues } from "@/components/admin/product/form";
import { ProductFormSheetContent } from "@/components/admin/product/sheet-content";
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
import { ExtendedProduct } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { MdArrowDropUp, MdCopyAll, MdEdit, MdShoppingCart } from "react-icons/md";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const products_columns: ColumnDef<ExtendedProduct>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: (cell) => (
      <img src={cell.getValue() as string} alt={cell.row.original.name} className="h-12 w-12 shrink-0 object-cover" />
    ),
    size: 24,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom du produit
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prix
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
    cell: (cell) => (cell.getValue() as number).toFixed(2).replace(".", "€"),
  },
  {
    header: "Infos complémentaires",
    accessorKey: "additional_information",
    cell: (cell) => (
      <div className="flex flex-col">
        <p>{(cell.getValue() as ExtendedProduct["additional_information"])?.[0]}</p>
        {(cell.getValue() as ExtendedProduct["additional_information"])?.[1] && (
          <small>{(cell.getValue() as ExtendedProduct["additional_information"])?.[1]}</small>
        )}
      </div>
      // <img src={cell.getValue() as string} alt={cell.row.original.name} className="h-12 w-12 shrink-0 object-cover" />
    ),
  },
  {
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantité
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
    accessorKey: "stock_quantity",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
                <MdCopyAll className="h-4 w-4 shrink-0" />
                {"Copier l'identifiant produit"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <MdShoppingCart className="h-4 w-4 shrink-0" />
                Rapprovisionner
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SheetTrigger className="inline-flex items-center gap-x-1">
                  <MdEdit className="h-4 w-4 shrink-0" />
                  Modifier/supprimer
                </SheetTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ProductFormSheetContent
            initialValues={{ ...product, type: product.type.toString() } as unknown as ProductCreateEditFormValues}
          />
        </Sheet>
      );
    },
  },
];
