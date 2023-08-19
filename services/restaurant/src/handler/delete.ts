import { RestaurantId } from "@restaurant/types/restaurant";
import { log } from "@restaurant/lib/log";
import { Data } from "@restaurant/types";
import prisma from "@restaurant/lib/prisma";

export const DeleteRestaurant = async (
  { request }: Data<RestaurantId>,
  callback: (err: any, response: null) => void
) => {
  try {
    const { id } = request;

    await prisma.restaurant.delete({ where: { id } });

    callback(null, null);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
