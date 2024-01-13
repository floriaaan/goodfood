import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { Data } from "@delivery/types";
import {
  DeliveryPersonAddress,
  LocationInput,
} from "@delivery/types/delivery-person";

export const ListNearDeliveryPersons = async (
  { request }: Data<LocationInput>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { latitude, longitude, radius_in_km } = request;

    const query = await prisma.deliveryPerson.findMany({
      include: { address: true, deliveries: { include: { address: true } } },
    });
    const delivery_persons = query.filter((deliveryPerson) => {
      const { lat, lng } = deliveryPerson.address as DeliveryPersonAddress;
      const distance = calculateDistance(latitude, longitude, lat, lng);
      return distance <= radius_in_km;
    });

    callback(null, { delivery_persons });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};

/**
 * Could use this raw query using Haversine formula to get locations within a radius:
 *      SELECT *
        FROM "DeliveryPerson"
        WHERE 6371 * 2 * ASIN(SQRT(POWER(SIN((latitude - $1) * pi()/180 / 2), 2) + COS(latitude * pi()/180) * COS($1 * pi()/180) * POWER(SIN((longitude - $2) * pi()/180 / 2), 2))) <= $3;
 *  with $1 = latitude, $2 = longitude, $3 = distance

    The Haversine formula is given by:
    ```
    a = POWER(SIN((latitude2 - latitude1) * pi()/180 / 2), 2) + COS(latitude1 * pi()/180) * COS(latitude2 * pi()/180) * POWER(SIN((longitude2 - longitude1) * pi()/180 / 2), 2)
    c = 2 * ASIN(SQRT(a))
    d = R * c
    ```
    where latitude1 and longitude1 are the coordinates of the first point, latitude2 and longitude2 are the coordinates of the second point, R is   the radius of the Earth (in this case, we are using the value 6371 which is the average radius of the Earth in kilometers), a is the square   of half the chord length between the points (in radians), c is the angular distance in radians, and d is the distance between the two points in kilometers.
 */

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function calculateDistance(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
) {
  const radLat1 = toRadians(latitude1);
  const radLat2 = toRadians(latitude2);
  const radDeltaLat = toRadians(latitude2 - latitude1);
  const radDeltaLon = toRadians(longitude2 - longitude1);

  const a =
    Math.sin(radDeltaLat / 2) * Math.sin(radDeltaLat / 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.sin(radDeltaLon / 2) *
      Math.sin(radDeltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return distance;
}
