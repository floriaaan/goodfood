import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import {
  GetSupplyOrdersByRestaurantRequest,
  GetSupplyOrdersByRestaurantResponse,
} from "@stock/types/stock";
import { Data } from "@stock/types";

export const GetSupplyOrdersByRestaurant = async (
  { request }: Data<GetSupplyOrdersByRestaurantRequest>,
  callback: (
    err: any,
    response: GetSupplyOrdersByRestaurantResponse | null
  ) => void
) => {
  try {
    const { restaurant_id } = request;
    const supply_orders = await prisma.supplyOrder.findMany({
      where: { ingredient_restaurant: { restaurant_id } },
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
