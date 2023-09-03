"use client";

import { CatalogFilters } from "@/components/catalog/filters";
import { ProductCatalogList } from "@/components/catalog/product";
import { productList } from "@/constants/data";
import { ProductType } from "@/types/product";
import { createContext, useContext, useState } from "react";

const CatalogContext = createContext({
  type: ProductType.PLATS,
  setType: (type: ProductType) => {},
});

export const useCatalogFilters = () => useContext(CatalogContext);

export const Catalog = () => {
  const [type, setType] = useState(ProductType.PLATS);

  return (
    <CatalogContext.Provider value={{ type, setType }}>
      <section className="grid auto-rows-max gap-4 lg:col-span-2 lg:grid-cols-3">
        <CatalogFilters />
        {productList
          .filter((p) => p.type === type)
          .map((product) => (
            <ProductCatalogList {...product} />
          ))}
      </section>
    </CatalogContext.Provider>
  );
};
