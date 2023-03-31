import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { RestaurantId, Delivery } from "@delivery/types/delivery";
import { ServerWritableStream } from "@grpc/grpc-js";

export const ListDeliveriesByRestaurant = async (
  call: ServerWritableStream<Delivery, RestaurantId>
) => {
  log.debug(
    "request received at ListDeliveriesByRestaurant handler\n",
    call.request
  );
  try {
    const { id } = call.request;

    const deliveries = await prisma.delivery.findMany({
      where: { restaurant_id: id },
      include: { person: true },
    });

    for (const delivery of deliveries) {
      call.write(delivery);
    }
    call.end();
  } catch (error) {
    log.error(error);

    call.end();
  }
};
