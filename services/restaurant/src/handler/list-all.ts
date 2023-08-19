import { log } from "@restaurant/lib/log";
import { Data } from "@restaurant/types";
import prisma from "@restaurant/lib/prisma";
import { Restaurant, RestaurantList } from "@restaurant/types/restaurant";

export const GetRestaurants = async (
  {}: Data<null>,
  callback: (err: any, response: RestaurantList | null) => void
) => {
  try {
    const restaurants =
      (await prisma.restaurant.findMany()) as unknown as Restaurant[];

    callback(null, { restaurants });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
