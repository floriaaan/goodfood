import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import {
  GetIngredientRestaurantsByRestaurantRequest,
  GetIngredientRestaurantsByRestaurantResponse,
} from "@stock/types/stock";
import { Data } from "@stock/types";

export const GetIngredientRestaurantsByRestaurant = async (
  { request }: Data<GetIngredientRestaurantsByRestaurantRequest>,
  callback: (
    err: any,
    response: GetIngredientRestaurantsByRestaurantResponse | null
  ) => void
) => {
  try {
    const { restaurant_id } = request;
    const ingredient_restaurants = await prisma.ingredientRestaurant.findMany({
      where: { restaurant_id },
      include: { supplier: true, ingredient: true },
    });
    callback(null, { ingredient_restaurants });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
