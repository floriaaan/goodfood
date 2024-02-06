"use client";
import { ProductStockCard } from "@/app/admin/stock/product/card";
import { SupplierCard } from "@/app/admin/stock/supply/supplier-card";
import { useAdmin } from "@/hooks/useAdmin";
import { LinkIcon, PlusIcon } from "lucide-react";

export default function StockPage() {
  const { restaurant, products, ingredients_restaurant, suppliers, supply_orders } = useAdmin();
  if (!restaurant) return null;

  return (
    <div className="flex flex-col">
      <h2 className="font-ultrabold inline-flex items-center gap-2 bg-neutral-100 p-2 text-3xl uppercase lg:p-8">
        Gestion des stocks pour:
        <span>{restaurant.name}</span>
      </h2>
      <h3 className="font-ultrabold inline-flex items-center gap-2 bg-neutral-800 p-2 text-2xl uppercase text-white lg:px-8 lg:py-4">
        Produits & ingrédients
      </h3>
      <div className="inline-flex gap-4 overflow-x-auto p-2 lg:p-8 ">
        <div className="flex h-[calc(12rem+16rem+2px)] w-80 flex-col gap-4 border border-transparent">
          <div className="flex h-1/2 w-full flex-col items-center justify-center gap-y-2 border">
            <PlusIcon className="h-8 w-8" />
            <span>Créer un ingrédient</span>
          </div>
          <div className="flex h-1/2 w-full flex-col items-center justify-center gap-y-2 border">
            <LinkIcon className="h-8 w-8" />
            <span>Lier un ingrédient au restaurant</span>
          </div>
        </div>
        {products.length > 0 ? (
          products.map((p) => (
            <ProductStockCard
              key={p.id}
              product={p}
              ingredients_restaurant={ingredients_restaurant.filter((ir) => ir.inProductListList.includes(p.id))}
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
        <div className="flex h-64 w-80 flex-col gap-4 border border-transparent">
          <div className="flex h-full w-full flex-col items-center justify-center gap-y-2 border">
            <PlusIcon className="h-8 w-8" />
            <span>Créer un fournisseur</span>
          </div>
        </div>
        {suppliers.length > 0 ? (
          suppliers.map((s) => (
            <SupplierCard
              key={s.id}
              supplier={s}
              supply_orders={supply_orders.filter((so) => so.supplierId === s.id)}
            />
          ))
        ) : (
          <div className="mx-auto flex h-[calc(12rem+16rem+2px)] items-center justify-center text-lg  text-neutral-500">
            {"Aucun fournisseur n'est disponible pour le moment."}
          </div>
        )}
      </div>
    </div>
  );
}
