import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import {
  GetSupplyOrdersByIngredientRestaurantRequest,
  GetSupplyOrdersByIngredientRestaurantResponse,
} from "@stock/types/stock";
import { Data } from "@stock/types";

export const GetSupplyOrdersByIngredientRestaurant = async (
  { request }: Data<GetSupplyOrdersByIngredientRestaurantRequest>,
  callback: (
    err: any,
    response: GetSupplyOrdersByIngredientRestaurantResponse | null
  ) => void
) => {
  try {
    const { ingredient_restaurant_id } = request;
    const supply_orders = await prisma.supplyOrder.findMany({
      where: { ingredient_restaurant_id },
      include: {
        supplier: true,
        ingredient_restaurant: {
          include: {
            ingredient: true,
            supplier: true,
          },
        },
      },
    });
    callback(null, { supply_orders });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
