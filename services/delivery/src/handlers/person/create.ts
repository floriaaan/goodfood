import { log } from "@delivery/lib/log";
import prisma from "@delivery/lib/prisma";
import { Data } from "@delivery/types";
import { DeliveryPersonCreateInput } from "@delivery/types/delivery-person";

export const CreateDeliveryPerson = async (
  { request }: Data<DeliveryPersonCreateInput>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { user_id, first_name, last_name, phone, address } = request;

    const deliveryPerson = await prisma.deliveryPerson.create({
      data: {
        user_id,
        first_name,
        last_name,
        phone,
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
      },
      include: { address: true },
    });
    callback(null, deliveryPerson);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
