import { log } from "@delivery/lib/log";
import prisma from "@delivery/lib/prisma";
import { Data } from "@delivery/types";
import { DeliveryPersonId } from "@delivery/types/delivery-person";

export const DeleteDeliveryPerson = async (
  { request }: Data<DeliveryPersonId>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { id } = request;
    await prisma.deliveryPerson.delete({ where: { id } });
    callback(null, {});
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
