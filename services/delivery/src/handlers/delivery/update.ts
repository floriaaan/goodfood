import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { Delivery } from "@delivery/types/delivery";
import { Data } from "@delivery/types";

export const UpdateDelivery = async (
  { request }: Data<Delivery>,
  callback: (err: any, response: any) => void
) => {
  try {
    const {
      eta,
      address,
      status,
      delivery_person_id,
      id,
      restaurant_address,
      restaurant_id,
    } = request;

    const delivery = await prisma.delivery.update({
      where: { id },
      data: {
        eta: new Date(eta), // todo: calculate new eta but avoid changing the original eta the most possible
        address: {
          update: {
            street: address.street,
            city: address.city,
            zipcode: address.zipcode,
            country: address.country,
            lat: address.lat,
            lng: address.lng,
          },
        },
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
        status,
        delivery_person: { connect: { id: delivery_person_id } },
      },
      include: {
        delivery_person: {
          include: { address: true },
        },
        address: true,
        restaurant_address: true,
      },
    });
    callback(null, delivery);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
