import { prisma } from "@delivery/lib/prisma";
import { log } from "@delivery/lib/log";
import { Delivery, UserId } from "@delivery/types/delivery";
import { ServerWritableStream } from "@grpc/grpc-js";

export const ListDeliveriesByUser = async (
  call: ServerWritableStream<Delivery, UserId>
) => {
  log.debug("request received at ListDeliveriesByUser handler\n", call.request);
  try {
    const { id } = call.request;

    const deliveries = await prisma.delivery.findMany({
      where: { user_id: id },
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
