"use client";

import { AmountStat } from "@/components/admin/stats/amountStat";
import { ProductCard } from "@/components/admin/stats/productCard";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { extendedProductList, stats } from "@/constants/data";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminStats() {
  const { restaurant } = useAdmin();

  if (!restaurant) return <LargeComponentLoader />;

  return (
    <div className="flex flex-col">
      <h2 className="font-ultrabold inline-flex items-center gap-2 bg-neutral-100 p-2 text-3xl uppercase lg:p-8">
        Statistiques et revenus pour:
        <span>{restaurant.name}</span>
      </h2>
      <h3 className="font-ultrabold inline-flex items-center gap-2 bg-neutral-800 p-2 text-2xl uppercase text-white lg:px-8 lg:py-4">
        Revenus
      </h3>
      <div className="grid grid-cols-3 gap-4 p-4 lg:px-8">
        {stats
          .filter((e, index) => [0, 1, 2].includes(index))
          .map((stat, index) => (
            <AmountStat
              key={index}
              title={stat.name}
              amount={Number.parseInt(stat.value)}
              percent={Number.parseInt(stat.changeValue)}
              lastUpdate={stat.date}
            />
          ))}
      </div>
      <h3 className="font-ultrabold inline-flex items-end gap-2 bg-neutral-800 p-2 text-2xl uppercase text-white lg:px-8 lg:py-4">
        Produits les plus demandés de la semaine{" "}
        <span className="mb-1 text-sm font-semibold text-neutral-400">Mis à jour à l’instant</span>
      </h3>
      <div className="grid grid-cols-3 gap-4 p-4 lg:px-8">
        {extendedProductList
          .filter((product, index) => [0, 1].includes(index))
          .map((product, index) => (
            <ProductCard key={product.id} product={product} index={index + 1} />
          ))}
      </div>
      <h3 className="font-ultrabold inline-flex items-end gap-2 bg-neutral-800 p-2 text-2xl uppercase text-white lg:px-8 lg:py-4">
        Dépenses
      </h3>
      <div className="grid grid-cols-3 gap-4 p-4 lg:px-8">
        {stats
          .filter((e, index) => [3, 4, 5].includes(index))
          .map((stat, index) => (
            <AmountStat
              key={index}
              title={stat.name}
              amount={Number.parseInt(stat.value)}
              percent={Number.parseInt(stat.changeValue)}
              reverseColor={true}
              lastUpdate={stat.date}
            />
          ))}
      </div>
    </div>
  );
}
