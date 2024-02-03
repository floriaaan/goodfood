import { log } from "@restaurant/lib/log";
import { Data } from "@restaurant/types";
import prisma from "@restaurant/lib/prisma";
import {
  ByLocationInput,
  Restaurant,
  RestaurantList,
} from "@restaurant/types/restaurant";
import { getDistance } from "geolib";

interface RestaurantWithDistance extends Restaurant {
  distance: number;
}

export const sortRestaurantsByDistance = (
  restaurants: Restaurant[],
  location: [number, number]
): RestaurantWithDistance[] => {
  return restaurants
    .map((restaurant) => ({
      ...restaurant,
      distance: getDistance(location, [
        restaurant.address.lat,
        restaurant.address.lng,
      ]),
    }))
    .sort((a, b) => a.distance - b.distance);
};

export const GetRestaurantsByLocation = async (
  { request }: Data<ByLocationInput>,
  callback: (err: any, response: RestaurantList | null) => void
) => {
  try {
    const { lat, lng } = request;

    const all = (await prisma.restaurant.findMany({
      include: { address: true },
    })) as unknown as Restaurant[];

    const restaurants = sortRestaurantsByDistance(all, [lat, lng])
      .map(({ distance, ...restaurant }) => restaurant as Restaurant)
      .filter((_, i) => i < 10);

    callback(null, { restaurants });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
