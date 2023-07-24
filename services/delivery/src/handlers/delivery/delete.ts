import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { DeliveryId } from "@delivery/types/delivery";
import { Data } from "@delivery/types";

export const DeleteDelivery = async (
  data: Data<DeliveryId>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { request } = data;
    const { id } = request;

    const delivery = await prisma.delivery.delete({ where: { id } });
    callback(null, delivery);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
