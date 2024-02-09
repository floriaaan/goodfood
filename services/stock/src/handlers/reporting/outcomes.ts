import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import { Data } from "@stock/types";
import {
  GetOutcomesByRestaurantRequest,
  GetOutcomesByRestaurantResponse,
} from "@stock/types/reporting";
import { fromInterval } from "@stock/lib/date";

export const GetOutcomesByRestaurant = async (
  { request }: Data<GetOutcomesByRestaurantRequest>,
  callback: (err: any, response: GetOutcomesByRestaurantResponse | null) => void
) => {
  try {
    const { interval, date, restaurant_id } = request;
    const { start, end } = fromInterval(interval, date);

    const supply_orders = await prisma.supplyOrder.findMany({
      where: {
        created_at: { gte: start, lte: end },
        ingredient_restaurant: { restaurant_id },
      },
    });

    const value = supply_orders.reduce(
      (acc, { unit_price, quantity }) => acc + unit_price * quantity,
      0
    );

    callback(null, { value });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
