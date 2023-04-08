import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { RestaurantId } from "@delivery/types/delivery";
import { Data } from "@delivery/types";

export const ListDeliveriesByRestaurant = async (
  data: Data<RestaurantId>,
  callback: (err: any, response: any) => void
) => {
  log.debug(
    "request received at ListDeliveriesByRestaurant handler\n",
    data.request
  );
  try {
    const { request } = data;
    const { id } = request;

    const deliveries = await prisma.delivery.findMany({
      where: { restaurant_id: id },
      include: { person: true },
    });
    callback(null, { deliveries });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
