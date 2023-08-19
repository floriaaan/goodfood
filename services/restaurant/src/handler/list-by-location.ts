import { log } from "@restaurant/lib/log";
import { Data } from "@restaurant/types";
import prisma from "@restaurant/lib/prisma";
import {
  ByLocationInput,
  Restaurant,
  RestaurantList,
} from "@restaurant/types/restaurant";
import geolib from "geolib";

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
      distance: geolib.getDistance(location, restaurant.location),
    }))
    .sort((a, b) => a.distance - b.distance);
};

export const GetRestaurantsByLocation = async (
  { request }: Data<ByLocationInput>,
  callback: (err: any, response: RestaurantList | null) => void
) => {
  try {
    const { location } = request;

    const all = (await prisma.restaurant.findMany()) as unknown as Restaurant[];

    const restaurants = sortRestaurantsByDistance(all, location)
      .map(({ distance, ...restaurant }) => restaurant as Restaurant)
      .filter((_, i) => i < 10);

    callback(null, { restaurants });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
