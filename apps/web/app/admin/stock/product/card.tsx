"use client";
import { IngredientRestaurantListItem } from "@/app/admin/stock/product/ingredient-restaurant/list-item";
import { useAdmin } from "@/hooks/useAdmin";
import { Product } from "@/types/product";
import { IngredientRestaurant } from "@/types/stock";
import Image from "next/image";
import { MdWarning, MdWarningAmber } from "react-icons/md";

export const ProductStockCard = ({
  product,
  ingredients_restaurant,
}: {
  product: Product;
  ingredients_restaurant: IngredientRestaurant[];
}) => {
  const { isIngredientsRestaurantLoading } = useAdmin();
  const hasThreshold = ingredients_restaurant.filter((ir) => ir.quantity <= ir.alertThreshold);
  const hasOutOfStock = ingredients_restaurant.filter((ir) => ir.quantity <= 0); // less than 0 cant be possible but who knows

  return (
    <div className="flex w-80 flex-col  border">
      <div className="relative h-48 w-full ">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={800}
          className="h-full w-full shrink-0 object-cover"
        />
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-t from-black  to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <span className="font-bold text-white">{product.name}</span>
        </div>
        <div className="absolute left-4 top-4 flex flex-col gap-0.5 ">
          {hasThreshold.length > 0 && (
            <div className="inline-flex items-center gap-x-1 bg-amber-100 px-1 py-0.5 text-xs text-yellow-700">
              <MdWarning className="h-3 w-3" />
              {`Seuil d'alerte atteint pour ${hasThreshold.length} ingrédient(s)`}
            </div>
          )}
          {hasOutOfStock.length > 0 && (
            <div className="inline-flex items-center gap-x-1 bg-red-100 px-1 py-0.5 text-xs text-red-700">
              <MdWarningAmber className="h-3 w-3" />
              {`Rupture de stock pour ${hasOutOfStock.length} ingrédient(s)`}
            </div>
          )}
        </div>
      </div>
      <div className="flex h-64 flex-col gap-1 overflow-y-auto p-4">
        <span className="mb-0.5 text-[10px] uppercase">Ingrédients et quantités</span>
        {ingredients_restaurant.length > 0 ? (
          ingredients_restaurant.map((ir) => <IngredientRestaurantListItem {...ir} key={ir.id.toString()} />)
        ) : isIngredientsRestaurantLoading ? (
          <span className="text-xs text-gray-500">Chargement des ingrédients...</span>
        ) : (
          <span className="text-xs text-gray-500">Aucun ingrédient disponible pour le moment.</span>
        )}
      </div>
    </div>
  );
};
