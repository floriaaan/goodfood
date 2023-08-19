import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import {
  UpdateIngredientRestaurantRequest,
  IngredientRestaurant,
} from "@stock/types/stock";
import { Data } from "@stock/types";

export const UpdateIngredientRestaurant = async (
  { request }: Data<UpdateIngredientRestaurantRequest>,
  callback: (err: any, response: IngredientRestaurant | null) => void
) => {
  try {
    const {
      id,
      alert_threshold,
      in_product_list,
      ingredient_id,
      price_per_kilo,
      quantity,
      restaurant_id,
      supplier_id,
      unit_price,
    } = request;
    const ingredient_restaurant = await prisma.ingredientRestaurant.update({
      where: { id },
      data: {
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
