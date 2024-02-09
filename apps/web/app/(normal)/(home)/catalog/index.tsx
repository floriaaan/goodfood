"use client";

import { CatalogFilters } from "@/app/(normal)/(home)/catalog/filters";
import { ProductCatalogListItem } from "@/app/(normal)/(home)/catalog/product";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { useBasket } from "@/hooks";
import { ProductType } from "@/types/product";
import { createContext, useContext, useState } from "react";
import { MdClose } from "react-icons/md";

const CatalogContext = createContext({
  type: ProductType.PLATS,
  setType: (_type: ProductType) => {},
});

export const useCatalogFilters = () => useContext(CatalogContext);

export const Catalog = () => {
  const { selectedRestaurant, selectedRestaurantId, products } = useBasket();

  const [type, setType] = useState(ProductType.PLATS);
  const list = products?.filter((p) => p.type === type) || [];

  return (
    <>
      {selectedRestaurantId && selectedRestaurant ? (
        <CatalogContext.Provider value={{ type, setType }}>
          <section className="grid auto-rows-max gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
            <CatalogFilters />
            {list
              .sort((a, b) =>
                // if a is out of stock, it goes to the end
                a.isOutOfStock === b.isOutOfStock ? 0 : a.isOutOfStock ? 1 : -1,
              )
              .map((product) => (
                <ProductCatalogListItem key={product.id} {...product} />
              ))}
            {list.length === 0 && (
              <div className="flex grow flex-col items-center justify-center gap-y-2 p-6 pb-12 sm:col-span-2 lg:col-span-3">
                <MdClose className="h-8 w-8 shrink-0" />
                <p className="text-xl font-semibold">Aucun produit dans cette catégorie</p>
                <small className="text-sm">Veuillez sélectionner une autre catégorie ou revenir plus tard</small>
              </div>
            )}
          </section>
        </CatalogContext.Provider>
      ) : (
        <div className="h-96 lg:col-span-2">
          <LargeComponentLoader className="mx-auto h-full w-full" />
        </div>
      )}
    </>
  );
};
