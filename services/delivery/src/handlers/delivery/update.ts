import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { Data, Delivery } from "@delivery/types/delivery";

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
        person: {
          connect: {
            id: delivery_person_id,
          },
        },
      },
      include: {
        person: true,
      },
    });
    callback(null, delivery);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
