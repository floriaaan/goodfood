"use client";
import { ProductStockCard } from "@/app/admin/stock/product/card";
import { useAdmin } from "@/hooks/useAdmin";

export default function StockPage() {
  const { restaurant, products, ingredients_restaurant } = useAdmin();
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
      {products.length > 0 ? (
        <div className="inline-flex gap-4 overflow-x-auto p-2 lg:p-8 ">
          {products.map((p) => (
            <ProductStockCard
              key={p.id}
              product={p}
              ingredients_restaurant={ingredients_restaurant.filter((ir) => ir.inProductListList.includes(p.id))}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center text-lg  text-neutral-500">
          {"Aucun produit n'est disponible pour le moment."}
        </div>
      )}
      <h3 className="font-ultrabold inline-flex items-center gap-2 bg-neutral-800 p-2 text-2xl uppercase text-white lg:px-8 lg:py-4">
        Fournisseurs & commandes fournisseurs
      </h3>
      <div className="flex h-32 items-center justify-center text-lg  text-neutral-500">
        {"Aucun fournisseur n'est disponible pour le moment."}
      </div>
    </div>
  );
}
