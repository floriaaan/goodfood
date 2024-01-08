"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useBasket } from "@/hooks/useBasket";
import dynamic from "next/dynamic";
import { SpinnerLoader } from "@/components/ui/loader/spinner";
import { LocationSheetContent } from "@/components/location/sheet-content";
import { useState } from "react";

export const LocationComponent = ({ trigger }: { className?: string; trigger: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedRestaurantId } = useBasket();

  return (
    <Sheet open={isModalOpen} onOpenChange={setIsModalOpen} defaultOpen={selectedRestaurantId === null}>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="mx-auto flex min-h-[12rem] w-full max-w-2xl flex-col gap-y-4 px-3 pb-8 pt-4 2xl:max-w-3xl"
      >
        <LocationSheetContent closeModal={() => setIsModalOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export const Location = dynamic(() => Promise.resolve(LocationComponent), {
  ssr: false,
  loading: () => (
    <div className="hidden lg:inline-flex">
      <SpinnerLoader className="h-8 w-8" />
    </div>
  ),
});

export * from "./trigger";
