"use client";

import { ProductActions } from "@/components/admin/product/actions";
import { cn } from "@/lib/utils";
import { ExtendedProduct } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { MdArrowDropUp } from "react-icons/md";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const products_columns: ColumnDef<ExtendedProduct>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: (cell) => (
      // eslint-disable-next-line @next/next/no-img-element
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
    accessorKey: "canMake",
    cell: (cell) => cell.getValue() as number,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return <ProductActions {...product} />;
    },
  },
];
