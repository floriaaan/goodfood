"use client";
import { IngredientRestaurantSheetContent } from "@/app/admin/stock/product/ingredient/sheet-content";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { IngredientRestaurant } from "@/types/stock";
import { MousePointerClickIcon } from "lucide-react";
import { useState } from "react";

export const IngredientRestaurantListItem = (ir: IngredientRestaurant) => {
  const isThresholdReached = ir.quantity <= ir.alertThreshold;
  const isOutOfStock = ir.quantity <= 0;
  const [open, onOpenChange] = useState(false);

  return (
    <Sheet {...{ open, onOpenChange }}>
      <SheetTrigger asChild>
        <div className="relative flex cursor-pointer flex-col gap-x-2 gap-y-1 border border-neutral-100 bg-neutral-50 px-2 py-1 text-xs hover:bg-neutral-100">
          <strong className="text-sm first-letter:uppercase">{ir.ingredient.name}</strong>
          <div className="flex gap-2">
            <span className="min-w-[64px] shrink-0">Quantité</span> <strong>{ir.quantity}</strong>
          </div>
          <div className="flex gap-2">
            <span className="min-w-[64px] shrink-0">Seuil</span> <strong>{ir.alertThreshold}</strong>
          </div>
          <div className="absolute right-1 top-1 text-[10px]">
            {isThresholdReached && !isOutOfStock && (
              <div className="flex items-center gap-2 text-amber-700">
                <span>{"Seuil d'alerte atteint"}</span>
              </div>
            )}
            {isOutOfStock && (
              <div className="flex items-center gap-2 text-red-700">
                <span>{"Rupture de stock"}</span>
              </div>
            )}
          </div>
          <div className="absolute bottom-1 right-1">
            <MousePointerClickIcon className="h-4 w-4" />
          </div>
        </div>
      </SheetTrigger>
      <IngredientRestaurantSheetContent closeSheet={() => onOpenChange(false)} ingredientRestaurant={ir} />
    </Sheet>
  );
};
