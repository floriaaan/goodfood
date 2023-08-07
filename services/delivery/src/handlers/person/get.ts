import { log } from "@delivery/lib/log";
import prisma from "@delivery/lib/prisma";
import { Data } from "@delivery/types";
import { DeliveryPersonId } from "@delivery/types/delivery-person";

export const GetDeliveryPerson = async (
  { request }: Data<DeliveryPersonId>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { id } = request;
    const deliveryPerson = await prisma.deliveryPerson.findUnique({
      where: { id },
    });
    callback(null, deliveryPerson);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
