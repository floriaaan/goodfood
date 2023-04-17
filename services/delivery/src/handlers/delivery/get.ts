import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { DeliveryId } from "@delivery/types/delivery";
import { Data } from "@delivery/types";

export const GetDelivery = async (
  data: Data<DeliveryId>,
  callback: (err: any, response: any) => void
) => {
  log.debug("request received at GetDelivery handler\n", data.request);
  try {
    const { request } = data;
    const { id } = request;

    const delivery = await prisma.delivery.findFirstOrThrow({
      where: { id },
      include: { delivery_person: true },
    });
    callback(null, delivery);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
