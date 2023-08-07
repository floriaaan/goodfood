import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import {
  GetIngredientRestaurantsByProductRequest,
  GetIngredientRestaurantsByProductResponse,
} from "@stock/types/stock";
import { Data } from "@stock/types";

export const GetIngredientRestaurantsByProduct = async (
  { request }: Data<GetIngredientRestaurantsByProductRequest>,
  callback: (
    err: any,
    response: GetIngredientRestaurantsByProductResponse | null
  ) => void
) => {
  try {
    const { product_id } = request;
    const ingredient_restaurants = await prisma.ingredientRestaurant.findMany({
      where: { in_product_list: { has: product_id } },
      include: { supplier: true, ingredient: true },
    });
    callback(null, { ingredient_restaurants });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
