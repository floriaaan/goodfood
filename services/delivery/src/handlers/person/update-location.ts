import { getDirections } from "@delivery/lib/eta";
import { log } from "@delivery/lib/log";
import prisma from "@delivery/lib/prisma";
import { Data } from "@delivery/types";
import { DeliveryAddress } from "@delivery/types/delivery";
import { DeliveryPersonUpdateLocationInput } from "@delivery/types/delivery-person";
import { Status } from "@prisma/client";

export const UpdateDeliveryPersonLocation = async (
  { request }: Data<DeliveryPersonUpdateLocationInput>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { delivery_person_id: input_id, address } = request;

    const { id: delivery_person_id } =
      await prisma.deliveryPerson.findFirstOrThrow({
        where: {
          OR: [{ id: input_id }, { user_id: input_id }],
        },
      });


    const deliveries_in_progress = await prisma.delivery.findMany({
      where: { delivery_person_id, status: Status.IN_PROGRESS },
      include: {
        address: true,
        restaurant_address: true,
        delivery_person: { include: { address: true } },
      },
    });

    // Change ETA for all deliveries in progress based on the new location
    const updated_deliveries = await Promise.all(
      deliveries_in_progress.map(async (delivery) => {
        const { lat: d_lat, lng: d_lng } = address; // Delivery person new location
        const { lat: r_lat, lng: r_lng } = delivery.restaurant_address; // Restaurant location
        const { lat: u_lat, lng: u_lng } = delivery.address as DeliveryAddress; // User location

        const distance = await getDirections([
          { lat: d_lat, lng: d_lng },
          { lat: r_lat, lng: r_lng },
          { lat: u_lat, lng: u_lng },
        ]);

        const { duration } = distance.routes[0];
        const eta = new Date(Date.now() + duration * 1000);
        return { id: delivery.id, eta };
      })
    );

    const deliveryPerson = await prisma.deliveryPerson.update({
      where: { id: delivery_person_id },
      data: {
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
        deliveries: {
          updateMany: updated_deliveries.map((delivery) => ({
            where: { id: delivery.id },
            data: { eta: delivery.eta },
          })),
        },
      },
      include: { address: true, deliveries: { include: { address: true } } },
    });
    callback(null, deliveryPerson);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
