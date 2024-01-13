import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { Delivery } from "@delivery/types/delivery";
import { Data } from "@delivery/types";

export const UpdateDelivery = async (
  { request }: Data<Delivery>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { eta, address, status, delivery_person_id, id } = request;

    const delivery = await prisma.delivery.update({
      where: { id },
      data: {
        eta: new Date(eta),
        address: { update: { ...address } },
        status,
        delivery_person: { connect: { id: delivery_person_id } },
      },
      include: { delivery_person: true, address: true },
    });
    callback(null, delivery);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
