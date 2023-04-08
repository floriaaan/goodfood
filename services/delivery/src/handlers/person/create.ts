import { log } from "@delivery/lib/log";
import prisma from "@delivery/lib/prisma";
import { Data } from "@delivery/types";
import { DeliveryPersonCreateInput } from "@delivery/types/delivery-person";

export const CreateDeliveryPerson = async (
  { request }: Data<DeliveryPersonCreateInput>,
  callback: (err: any, response: any) => void
) => {
  log.debug("request received at CreateDeliveryPerson handler\n", request);
  try {
    const { first_name, last_name, phone, location } = request;

    const deliveryPerson = await prisma.deliveryPerson.create({
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
