import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { Data, UserId } from "@delivery/types/delivery";

export const ListDeliveriesByUser = async (
  data: Data<UserId>,
  callback: (err: any, response: any) => void
) => {
  log.debug("request received at ListDeliveriesByUser handler\n", data.request);
  try {
    const { request } = data;
    const { id } = request;

    const deliveries = await prisma.delivery.findMany({
      where: { user_id: id },
      include: { person: true },
    });
    callback(null, { deliveries });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
