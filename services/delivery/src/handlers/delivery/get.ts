import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { Data, DeliveryId } from "@delivery/types/delivery";

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
      include: { person: true },
    });
    callback(null, delivery);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
