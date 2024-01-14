import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { Data } from "@delivery/types";
import {
  DeliveryPersonAddress,
  LocationInput,
} from "@delivery/types/delivery-person";
import { calculateDistance } from "@delivery/lib/distance";

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
