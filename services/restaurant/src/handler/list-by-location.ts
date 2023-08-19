import { log } from "@restaurant/lib/log";
import { Data } from "@restaurant/types";
import prisma from "@restaurant/lib/prisma";
import {
  ByLocationInput,
  Restaurant,
  RestaurantList,
} from "@restaurant/types/restaurant";

export const GetRestaurantsByLocation = async (
  { request }: Data<ByLocationInput>,
  callback: (err: any, response: RestaurantList | null) => void
) => {
  try {
    const { location } = request;

    const restaurants = (await prisma.restaurant.findMany({
      where: {
        location: {
          equals: location,
        },
      },
    })) as unknown as Restaurant[];

    callback(null, { restaurants });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
