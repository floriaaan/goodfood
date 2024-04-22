"use client";

import { PromotionFormSheetContent } from "@/components/admin/promotion/sheet-content";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useAdmin } from "@/hooks/useAdmin";
import { useState } from "react";
import { MdAdd, MdRefresh } from "react-icons/md";

export const PromotionCreateSheet = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button className="w-fit bg-black px-6 text-white">
          <MdAdd className="h-4 w-4 shrink-0" />
          Créer un code promotionnel
        </Button>
      </SheetTrigger>
      <PromotionFormSheetContent closeSheet={() => setSheetOpen(false)} />
    </Sheet>
  );
};

export const PromotionRefreshSheet = () => {
  const { refetchPromotions } = useAdmin();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button onClick={refetchPromotions} className="w-fit bg-black px-6 text-white">
          <MdRefresh className="h-4 w-4 shrink-0" />
          Actualiser
        </Button>
      </SheetTrigger>
    </Sheet>
  );
};
