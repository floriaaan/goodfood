import { log } from "@delivery/lib/log";
import prisma from "@delivery/lib/prisma";
import { Data } from "@delivery/types";
import { DeliveryPerson } from "@delivery/types/delivery-person";

export const UpdateDeliveryPerson = async (
  { request }: Data<DeliveryPerson>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { id, first_name, last_name, address, phone } = request;

    const deliveryPerson = await prisma.deliveryPerson.update({
      where: { id },
      data: {
        first_name,
        last_name,
        phone,
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
      },
      include: { address: true, deliveries: { include: { address: true } } },
    });
    callback(null, deliveryPerson);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
