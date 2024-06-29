import { log } from "@delivery/lib/log";
import { prisma } from "@delivery/lib/prisma";
import { Data } from "@delivery/types";
import { DeliveryPersonId } from "@delivery/types/delivery-person";

export const ListDeliveriesByDeliveryPerson = async (
  { request }: Data<DeliveryPersonId>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { id } = request;

    const deliveries = await prisma.delivery.findMany({
      where: { delivery_person: { user_id: id } },
      include: {
        delivery_person: { include: { address: true } },
        address: true,
        restaurant_address: true,
      },
    });
    callback(null, { deliveries });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
