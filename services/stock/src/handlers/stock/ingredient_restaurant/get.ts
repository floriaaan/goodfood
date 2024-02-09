import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import {
  GetIngredientRestaurantRequest,
  IngredientRestaurant,
} from "@stock/types/stock";
import { Data } from "@stock/types";

export const GetIngredientRestaurant = async (
  { request }: Data<GetIngredientRestaurantRequest>,
  callback: (err: any, response: IngredientRestaurant | null) => void
) => {
  try {
    const { id } = request;
    const ingredient_restaurant =
      await prisma.ingredientRestaurant.findUniqueOrThrow({
        where: { id },
        include: { supplier: true, ingredient: true },
      });
    callback(null, ingredient_restaurant);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
