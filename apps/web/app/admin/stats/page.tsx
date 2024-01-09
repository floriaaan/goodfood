"use client";

import { AmountStat } from "@/components/admin/stats/amountStat";
import { ProductCard } from "@/components/admin/stats/productCard";
import { extendedProductList, restaurantList, stats } from "@/constants/data";
import { useAdmin } from "@/hooks/useAdmin";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";

export default function AdminStats() {
  const { selectedRestaurantId } = useAdmin();
  if (!selectedRestaurantId) return null;
  const restaurant = restaurantList.find((restaurant) => restaurant.id === selectedRestaurantId);
  if (!restaurant) return <LargeComponentLoader />;
  return (
    <div className="relative flex flex-col gap-20 p-16">
      <h1 className="text-5xl font-extrabold">{restaurant.name}</h1>
      <div className="flex flex-wrap gap-16">
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
      <div className="flex-col gap-16 ">
        <h2 className="pb-4 text-3xl font-bold">
          Produits les plus demandés de la semaine{" "}
          <span className="text-sm font-semibold text-gray-500">Mis à jour à l’instant</span>
        </h2>

        <div className="flex max-w-5xl flex-wrap gap-8 overflow-hidden">
          {extendedProductList
            .filter((product, index) => [0, 1].includes(index))
            .map((product, index) => (
              <ProductCard key={product.id} product={product} index={index + 1} />
            ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-16">
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
