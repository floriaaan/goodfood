import { log } from "@restaurant/lib/log";
import { Data } from "@restaurant/types";
import prisma from "@restaurant/lib/prisma";
import { Restaurant } from "@restaurant/types/restaurant";

export const UpdateRestaurant = async (
  { request }: Data<Restaurant>,
  callback: (err: any, response: Restaurant | null) => void
) => {
  try {
    const { id, location, name, openingHours, address, description, phone } =
      request;

    const restaurant = (await prisma.restaurant.update({
      where: { id },
      data: {
        location,
        name,
        openingHours,
        address,
        description,
        phone,
      },
    })) as unknown as Restaurant;

    callback(null, restaurant);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
