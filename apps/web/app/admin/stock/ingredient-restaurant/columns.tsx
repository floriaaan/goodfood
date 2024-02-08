"use client";

import { IngredientRestaurantSheetContent } from "@/app/admin/stock/product/ingredient-restaurant/sheet-content";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useAdmin } from "@/hooks/useAdmin";
import { toPrice } from "@/lib/product/toPrice";
import { cn } from "@/lib/utils";
import { IngredientRestaurant } from "@/types/stock";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { MdArrowDropUp, MdCopyAll, MdEdit } from "react-icons/md";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const ir_columns: ColumnDef<IngredientRestaurant>[] = [
  {
    accessorKey: "ingredient",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ingrédient
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
    cell: ({ getValue, row }) => {
      const i = getValue() as IngredientRestaurant["ingredient"];
      const ir = row.original;

      return (
        <div className="flex flex-col gap-1">
          <strong>{i.name}</strong>
          <div className="inline-flex items-center text-xs">
            <span>({toPrice(ir.unitPrice)}/unité)</span>
            <span>({toPrice(ir.pricePerKilo)}/kilo)</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
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
  },
  {
    accessorKey: "alertThreshold",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {"Seuil d'alerte"}
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
  },
  {
    accessorKey: "supplier",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fournisseur
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
    cell: ({ getValue }) => {
      const p = getValue() as IngredientRestaurant["supplier"];

      return <span>{p.name}</span>;
    },
  },
  {
    accessorKey: "inProductListList",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Utilisé dans
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
    cell: ({ getValue }) => {
      const p = getValue() as IngredientRestaurant["inProductListList"];

      return <InProductListCell {...{ p }} />;
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(p.id.toString())}>
                <MdCopyAll className="h-4 w-4 shrink-0" />
                {"Copier l'identifiant ingrédient/restaurant"}
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
          <IngredientRestaurantSheetContent ingredientRestaurant={p} closeSheet={() => {}} />
        </Sheet>
      );
    },
  },
];

const InProductListCell = ({ p }: { p: IngredientRestaurant["inProductListList"] }) => {
  const { products } = useAdmin();
  return (
    <div className="flex flex-col gap-1">
      <strong>{p.length} produits</strong>
      <div className="line-clamp-1 text-xs">
        {p
          .map((p) => {
            const product = products.find((pr) => pr.id === p);
            if (!product) return null;
            return product.name;
          })
          .filter(Boolean)
          .join(", ")}
      </div>
    </div>
  );
};
