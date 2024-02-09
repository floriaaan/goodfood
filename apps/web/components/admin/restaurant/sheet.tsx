"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { MdAdd, MdRefresh } from "react-icons/md";
import { RestaurantFormSheetContent } from "@/components/admin/restaurant/sheet-content";
import { useAdmin } from "@/hooks/useAdmin";

export const RestaurantCreateSheet = () => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button className="w-fit bg-black px-6 text-white">
          <MdAdd className="h-4 w-4 shrink-0" />
          Créer un restaurant
        </Button>
      </SheetTrigger>
      <RestaurantFormSheetContent closeSheet={() => setSheetOpen(false)} />
    </Sheet>
  );
};

export const RestaurantRefreshSheet = () => {
  const { refetchRestaurants } = useAdmin();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button onClick={refetchRestaurants} className="w-fit bg-black px-6 text-white">
          <MdRefresh className="h-4 w-4 shrink-0" />
          Actualiser
        </Button>
      </SheetTrigger>
    </Sheet>
  );
};
