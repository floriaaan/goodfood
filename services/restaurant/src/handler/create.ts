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
    const { name, openingHours, address, description, phone, userIds } =
      request;

    const restaurant = (await prisma.restaurant.create({
      data: {
        name,
        openingHours,
        address: {
          create: {
            lat: address.lat,
            lng: address.lng,

            street: address.street,
            city: address.city,
            zipcode: address.zipcode,
            country: address.country,
          },
        },
        description,
        phone,
        userIds,
      },
      include: { address: true },
    })) as unknown as Restaurant;

    callback(null, restaurant);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
