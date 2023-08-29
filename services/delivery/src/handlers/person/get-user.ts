import { log } from "@delivery/lib/log";
import prisma from "@delivery/lib/prisma";
import { Data } from "@delivery/types";
import { DeliveryPersonUserId } from "@delivery/types/delivery-person";

export const GetDeliveryPersonByUser = async (
  { request }: Data<DeliveryPersonUserId>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { id } = request;
    const deliveryPerson = await prisma.deliveryPerson.findUnique({
      where: { user_id: id },
      include:{
        deliveries: true,
      }
    });
    callback(null, deliveryPerson);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
