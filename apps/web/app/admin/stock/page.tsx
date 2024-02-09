"use client";
import { ir_columns } from "@/app/admin/stock/ingredient-restaurant/columns";
import { ProductStockCard } from "@/app/admin/stock/product/card";
import { IngredientRestaurantSheetContent } from "@/app/admin/stock/product/ingredient-restaurant/sheet-content";
import { IngredientSheetContent } from "@/app/admin/stock/product/ingredient/sheet-content";
import { SupplierCard } from "@/app/admin/stock/supplier/card";
import { SupplierSheetContent } from "@/app/admin/stock/supplier/sheet-content";
import { DataTable } from "@/components/ui/data-table";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { LinkIcon, PlusIcon } from "lucide-react";
import {useEffect, useState} from "react";

export default function StockPage() {
  const { refetchProducts, restaurant, products, ingredients, ingredients_restaurant, suppliers, supply_orders } = useAdmin();
  const [ingredientSheetOpen, setIngredientSheetOpen] = useState(false);
  const [ingredientRestaurantSheetOpen, setIngredientRestaurantSheetOpen] = useState(false);
  const [supplierSheetOpen, setSupplierSheetOpen] = useState(false);

  useEffect(() => refetchProducts, []);


  if (!restaurant) return <LargeComponentLoader />;

  return (
    <div className="flex flex-col">
      <h2 className="font-ultrabold inline-flex items-center gap-2 bg-neutral-100 p-2 text-3xl uppercase lg:p-8">
        Gestion des stocks pour:
        <span>{restaurant.name}</span>
      </h2>
      <h3 className="font-ultrabold inline-flex items-center gap-2 bg-neutral-800 p-2 text-2xl uppercase text-white lg:px-8 lg:py-4">
        Produits & quantités
      </h3>
      <div className="inline-flex gap-4 overflow-x-auto p-2 lg:p-8 ">
        <div className="flex h-[calc(12rem+16rem+2px)] w-80 flex-col gap-4 border border-transparent">
          <Sheet
            {...{
              isOpen: ingredientSheetOpen,
              onOpenChange: setIngredientSheetOpen,
            }}
          >
            <SheetTrigger asChild>
              <div className=" flex h-1/2 w-full cursor-pointer flex-col items-center justify-center gap-y-2 border p-4 hover:bg-neutral-100">
                <PlusIcon className="h-8 w-8" />
                <span className="text-center font-semibold uppercase">Créer un ingrédient</span>
              </div>
            </SheetTrigger>
            <IngredientSheetContent closeSheet={() => setIngredientSheetOpen(false)} />
          </Sheet>
          <Sheet
            {...{
              isOpen: ingredientRestaurantSheetOpen,
              onOpenChange: setIngredientRestaurantSheetOpen,
            }}
          >
            <SheetTrigger asChild>
              <div className="flex h-1/2 w-full cursor-pointer flex-col items-center justify-center gap-y-2 border p-4 hover:bg-neutral-100">
                <LinkIcon className="h-8 w-8" />
                <span className="flex flex-col items-center justify-center gap-y-0.5">
                  <span className="text-center font-semibold uppercase">Lier un ingrédient au restaurant</span>
                  <small
                    className={cn(
                      "text-xs text-neutral-500",
                      ingredients.filter((i) => !ingredients_restaurant.find((ir) => ir.ingredientId === i.id)).length >
                        0 && "font-semibold underline",
                    )}
                  >
                    {ingredients.filter((i) => !ingredients_restaurant.find((ir) => ir.ingredientId === i.id)).length}{" "}
                    ingrédient non lié
                  </small>
                  <small
                    className={cn(
                      "text-xs text-neutral-500",
                      ingredients_restaurant.filter((i) => i.inProductListList.length === 0).length > 0 &&
                        "font-semibold underline",
                    )}
                  >
                    {ingredients_restaurant.filter((i) => i.inProductListList.length === 0).length} ingrédient liés non
                    utilisés
                  </small>
                </span>
              </div>
            </SheetTrigger>
            <IngredientRestaurantSheetContent closeSheet={() => setIngredientRestaurantSheetOpen(false)} />
          </Sheet>
        </div>
        {products.length > 0 ? (
          products.map((p) => (
            <ProductStockCard
              key={p.id}
              product={p}
              ingredients_restaurant={ingredients_restaurant
                .filter((ir) => ir.inProductListList.includes(p.id))
                .sort((a, b) => a.id - b.id)}
            />
          ))
        ) : (
          <div className="mx-auto flex h-[calc(12rem+16rem+2px)] items-center justify-center text-lg  text-neutral-500">
            {"Aucun produit n'est disponible pour le moment."}
          </div>
        )}
      </div>
      <h3 className="font-ultrabold inline-flex items-center gap-2 bg-neutral-800 p-2 text-2xl uppercase text-white lg:px-8 lg:py-4">
        Fournisseurs & commandes fournisseurs
      </h3>
      <div className="inline-flex gap-4 overflow-x-auto p-2 lg:p-8 ">
        <div className="flex h-80 w-60 flex-col gap-4 border border-transparent">
          <Sheet
            {...{
              isOpen: supplierSheetOpen,
              onOpenChange: setSupplierSheetOpen,
            }}
          >
            <SheetTrigger asChild>
              <div className=" flex h-full w-full cursor-pointer flex-col items-center justify-center gap-y-2 border p-4 hover:bg-neutral-100">
                <PlusIcon className="h-8 w-8" />
                <span className="text-center font-semibold uppercase">Créer un fournisseur</span>
              </div>
            </SheetTrigger>
            <SupplierSheetContent closeSheet={() => setSupplierSheetOpen(false)} />
          </Sheet>
        </div>
        {suppliers.length > 0 ? (
          suppliers
            .sort((a, b) => a.id - b.id)
            .sort(
              (a, b) =>
                supply_orders.filter((so) => so.supplierId === a.id).length -
                supply_orders.filter((so) => so.supplierId === b.id).length,
            )
            .map((s) => (
              <SupplierCard
                key={s.id}
                supplier={s}
                supply_orders={supply_orders.filter((so) => so.supplierId === s.id)}
              />
            ))
        ) : (
          <div className="mx-auto flex h-64 items-center justify-center text-lg  text-neutral-500">
            {"Aucun fournisseur n'est disponible pour le moment."}
          </div>
        )}
      </div>
      <h3 className="font-ultrabold inline-flex items-center gap-2 bg-neutral-800 p-2 text-2xl uppercase text-white lg:px-8 lg:py-4">
        Ingrédients du restaurant
      </h3>
      <div className="flex w-full gap-4 p-2 lg:p-8">
        <DataTable data={ingredients_restaurant} columns={ir_columns} />
      </div>
    </div>
  );
}
