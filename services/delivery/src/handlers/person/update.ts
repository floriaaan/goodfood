import { log } from "@delivery/lib/log";
import prisma from "@delivery/lib/prisma";
import { Data } from "@delivery/types";
import { DeliveryPerson } from "@delivery/types/delivery-person";

export const UpdateDeliveryPerson = async (
  { request }: Data<DeliveryPerson>,
  callback: (err: any, response: any) => void
) => {
  log.debug("request received at UpdateDeliveryPerson handler\n", request);
  try {
    const { id, first_name, last_name, location, phone } = request;

    const deliveryPerson = await prisma.deliveryPerson.update({
      where: { id },
      data: {
        first_name,
        last_name,
        phone,
        location: {
          set: location,
        },
      },
    });
    callback(null, deliveryPerson);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
