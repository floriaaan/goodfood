import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { DeliveryId } from "@delivery/types/delivery";
import { Data } from "@delivery/types";

export const GetDelivery = async (
  { request }: Data<DeliveryId>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { id } = request;

    const delivery = await prisma.delivery.findFirstOrThrow({
      where: { id },
      include: { delivery_person: true, address: true },
    });
    callback(null, delivery);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
