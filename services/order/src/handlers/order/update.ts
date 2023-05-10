import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import { UpdateOrderRequest, Order } from "@order/types/order";
import { Data } from "@order/types";
import { toGrpc } from "@order/lib/transformer";

export const UpdateOrder = async (
  { request }: Data<UpdateOrderRequest>,
  callback: (err: any, response: Order | null) => void
) => {
  log.debug("request received at UpdateOrder handler\n", request);
  try {
    const { delivery_id, payment_id, id, status } = request;

    // todo: calculate total from basket_snapshot
    const total = 0; // basket_snapshot.reduce;

    const order = await prisma.order.update({
      where: { id },
      data: {
        delivery_id,
        payment_id,
        status,
      },
      include: { basket_snapshot: true, user: true },
    });
    callback(null, toGrpc(order));
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
