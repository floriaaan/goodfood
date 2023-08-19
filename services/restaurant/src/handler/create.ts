import {
  RestaurantCreateInput,
  Restaurant,
} from "@restaurant/types/restaurant";
import { log } from "@restaurant/lib/log";
import { Data } from "@restaurant/types";
import prisma from "@restaurant/lib/prisma";

export const CreateRestaurant = async (
  { request }: Data<RestaurantCreateInput>,
  callback: (err: any, response: Restaurant | null) => void
) => {
  try {
    const { location, name, openingHours, address, description, phone } =
      request;

    const restaurant = (await prisma.restaurant.create({
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
