import { log } from "@delivery/lib/log";
import prisma from "@delivery/lib/prisma";
import { Data } from "@delivery/types";
import { DeliveryPersonUpdateLocationInput } from "@delivery/types/delivery-person";

export const UpdateDeliveryPersonLocation = async (
  { request }: Data<DeliveryPersonUpdateLocationInput>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { delivery_person_id, latitude, longitude } = request;

    const deliveryPerson = await prisma.deliveryPerson.update({
      where: { id: delivery_person_id },
      data: { address: { update: { lat: latitude, lng: longitude } } },
      include: { address: true, deliveries: { include: { address: true } } },
    });
    callback(null, deliveryPerson);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
