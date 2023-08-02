import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { DeliveryCreateInput } from "@delivery/types/delivery";
import { Data } from "@delivery/types";

export const CreateDelivery = async (
  { request }: Data<DeliveryCreateInput>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { eta, address, status, delivery_person_id, restaurant_id, user_id } =
      request;

    const delivery = await prisma.delivery.create({
      data: {
        eta: new Date(eta),
        address,
        status,
        delivery_person: {
          connect: {
            id: delivery_person_id,
          },
        },
        restaurant_id,
        user_id,
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