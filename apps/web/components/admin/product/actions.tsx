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
import { Product } from "@/types/product";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { MdCopyAll, MdEdit, MdShoppingCart } from "react-icons/md";

export const ProductActions = (product: Product) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
        initialValues={
          {
            ...product,
            type: product.type.toString(),
            restaurantId: product.restaurantId?.toString(),
            categoriesList: product.categoriesList?.map((c) => c.id) || [],
            allergensList: product.allergensList?.map((a) => a.id) || [],
          } as unknown as ProductCreateEditFormValues
        }
        id={product.id}
        closeSheet={() => setOpen(false)}
      />
    </Sheet>
  );
};
