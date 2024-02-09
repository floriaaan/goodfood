import { Restaurant, RestaurantId } from "@restaurant/types/restaurant";
import { log } from "@restaurant/lib/log";
import { Data } from "@restaurant/types";
import prisma from "@restaurant/lib/prisma";

export const GetRestaurant = async (
  { request }: Data<RestaurantId>,
  callback: (err: any, response: Restaurant | null) => void
) => {
  try {
    const { id } = request;

    const restaurant = (await prisma.restaurant.findFirstOrThrow({
      where: { id },
      include: { address: true },
    })) as unknown as Restaurant;

    callback(null, restaurant);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
