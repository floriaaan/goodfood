import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { DeliveryCreateInput } from "@delivery/types/delivery";
import { Data } from "@delivery/types";
import { DeliveryPersonAddress } from "@delivery/types/delivery-person";
import { calculateDistance } from "@delivery/lib/distance";
import { getDirections } from "@delivery/lib/eta";

export const CreateDelivery = async (
  { request }: Data<DeliveryCreateInput>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { address, restaurant_id, user_id, restaurant_address } = request;
    const { lat: u_lat, lng: u_lng } = address;
    const { lat: r_lat, lng: r_lng } = restaurant_address;

    /*
      ETA calculation:
      - Get delivery person's location
      - Get restaurant's location
      - Get given address's location

      - Get nearest delivery person to restaurant
      - Calculate distance between delivery person and restaurant
      - Calculate distance between restaurant and given address

      => ETA = distance between delivery person and restaurant + distance between restaurant and given address
    */

    const persons = (
      await prisma.deliveryPerson.findMany({
        include: { address: true, deliveries: { include: { address: true } } },
      })
    ).sort((a, b) => {
      const { lat: a_lat, lng: a_lng } = a.address as DeliveryPersonAddress;
      const distance = calculateDistance(r_lat, r_lng, a_lat, a_lng);

      const { lat: b_lat, lng: b_lng } = b.address as DeliveryPersonAddress;
      const distance2 = calculateDistance(r_lat, r_lng, b_lat, b_lng);

      return distance - distance2;
    });
    if (persons.length === 0) throw new Error("No delivery person found");
    const [nearestPerson] = persons;

    const distance = await getDirections([
      {
        lat: (nearestPerson.address as DeliveryPersonAddress).lat,
        lng: (nearestPerson.address as DeliveryPersonAddress).lng,
      },
      { lat: r_lat, lng: r_lng },
      { lat: u_lat, lng: u_lng },
    ]);

    const { duration } = distance.routes[0];
    const eta = new Date(Date.now() + duration * 1000);

    const delivery = await prisma.delivery.create({
      data: {
        eta,
        address: {
          create: {
            street: address.street,
            city: address.city,
            zipcode: address.zipcode,
            country: address.country,
            lat: address.lat,
            lng: address.lng,
          },
        },
        delivery_person: { connect: { id: nearestPerson.id } },
        restaurant_address: {
          connectOrCreate: {
            where: { id: restaurant_id },
            create: {
              id: restaurant_id,
              street: restaurant_address.street,
              city: restaurant_address.city,
              zipcode: restaurant_address.zipcode,
              country: restaurant_address.country,
              lat: restaurant_address.lat,
              lng: restaurant_address.lng,
            },
          },
        },
        user_id,
      },
      include: {
        delivery_person: { include: { address: true } },
        restaurant_address: true,
        address: true,
      },
    });
    callback(null, delivery);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
