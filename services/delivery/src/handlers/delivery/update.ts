import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { Delivery } from "@delivery/types/delivery";
import { Data } from "@delivery/types";

export const UpdateDelivery = async (
  data: Data<Delivery>,
  callback: (err: any, response: any) => void
) => {
  log.debug("request received at UpdateDelivery handler\n", data.request);
  try {
    const { eta, address, status, delivery_person_id, id } = data.request;

    const delivery = await prisma.delivery.update({
      where: { id },
      data: {
        eta: new Date(eta),
        address,
        status,
        delivery_person: {
          connect: {
            id: delivery_person_id,
          },
        },
      },
      include: {
        delivery_person: true,
      },
    });
    callback(null, delivery);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
