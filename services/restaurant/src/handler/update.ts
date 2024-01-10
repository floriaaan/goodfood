import { log } from "@restaurant/lib/log";
import { Data } from "@restaurant/types";
import prisma from "@restaurant/lib/prisma";
import { Restaurant } from "@restaurant/types/restaurant";

export const UpdateRestaurant = async (
  { request }: Data<Restaurant>,
  callback: (err: any, response: Restaurant | null) => void
) => {
  try {
    const { id, name, openingHours, address, description, phone, userIds } =
      request;

    const restaurant = (await prisma.restaurant.update({
      where: { id },
      data: {
        name,
        openingHours,
        address: {
          update: {
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
