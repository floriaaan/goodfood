"use client";

import { CatalogFilters } from "@/app/(normal)/(home)/catalog/filters";
import { ProductCatalogListItem } from "@/app/(normal)/(home)/catalog/product";
import { useBasket } from "@/hooks";
import { fetchAPI } from "@/lib/fetchAPI";
// import { productList } from "@/constants/data";
import { Product, ProductType } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { MdClose } from "react-icons/md";

const CatalogContext = createContext({
  type: ProductType.PLATS,
  setType: (_type: ProductType) => {},
});

export const useCatalogFilters = () => useContext(CatalogContext);

export const Catalog = () => {
  const { selectedRestaurantId } = useBasket();
  const { data: productList } = useQuery<Product[]>({
    queryKey: [`${selectedRestaurantId}/products`],
    queryFn: async () => await (await fetchAPI(`/api/product/by-restaurant/${selectedRestaurantId}`)).json(),
    enabled: !!selectedRestaurantId,
    placeholderData: [],
  });

  const [type, setType] = useState(ProductType.PLATS);
  const list = productList?.filter((p) => p.type === type) || [];

  return (
    <CatalogContext.Provider value={{ type, setType }}>
      <section className="grid auto-rows-max gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
        <CatalogFilters />
        {list.map((product) => (
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
  );
};
