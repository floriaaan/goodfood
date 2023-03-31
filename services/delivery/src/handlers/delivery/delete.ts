import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { Data, DeliveryId } from "@delivery/types/delivery";

export const DeleteDelivery = async (
  data: Data<DeliveryId>,
  callback: (err: any, response: any) => void
) => {
  log.debug("request received at DeleteDelivery handler\n", data.request);
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
