import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import {
  CreateIngredientRestaurantRequest,
  IngredientRestaurant,
} from "@stock/types/stock";
import { Data } from "@stock/types";

export const CreateIngredientRestaurant = async (
  { request }: Data<CreateIngredientRestaurantRequest>,
  callback: (err: any, response: IngredientRestaurant | null) => void
) => {
  try {
    const {
      alert_threshold,
      in_product_list,
      ingredient_id,
      price_per_kilo,
      quantity,
      restaurant_id,
      supplier_id,
      unit_price,
    } = request;

    const ingredient_restaurant = await prisma.ingredientRestaurant.create({
      data: {
        key: `${restaurant_id}/${ingredient_id}`,
        alert_threshold,
        in_product_list,
        ingredient_id,
        price_per_kilo,
        quantity,
        restaurant_id,
        supplier_id,
        unit_price,
      },
      include: { supplier: true, ingredient: true },
    });

    callback(null, ingredient_restaurant);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
