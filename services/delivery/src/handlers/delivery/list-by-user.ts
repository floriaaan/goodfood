import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { UserId } from "@delivery/types/delivery";
import { Data } from "@delivery/types";

export const ListDeliveriesByUser = async (
  data: Data<UserId>,
  callback: (err: any, response: any) => void
) => {
  try {
    const { request } = data;
    const { id } = request;

    const deliveries = await prisma.delivery.findMany({
      where: { user_id: id },
      include: { delivery_person: true },
    });
    callback(null, { deliveries });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
