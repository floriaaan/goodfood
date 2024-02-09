"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { MdAdd, MdRefresh } from "react-icons/md";
import { useAdmin } from "@/hooks/useAdmin";
import { ProductFormSheetContent } from "@/components/admin/product/sheet-content";

export const ProductCreateSheet = () => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button className="w-fit bg-black px-6 text-white">
          <MdAdd className="h-4 w-4 shrink-0" />
          Créer un produit
        </Button>
      </SheetTrigger>
      <ProductFormSheetContent closeSheet={() => setSheetOpen(false)} />
    </Sheet>
  );
};

export const ProductRefreshSheet = () => {
  const { refetchExtendedProducts } = useAdmin();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button onClick={refetchExtendedProducts} className="w-fit bg-black px-6 text-white">
          <MdRefresh className="h-4 w-4 shrink-0" />
          Actualiser
        </Button>
      </SheetTrigger>
    </Sheet>
  );
};
