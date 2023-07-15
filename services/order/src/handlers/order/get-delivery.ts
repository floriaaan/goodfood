import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import {
  GetOrderByDeliveryRequest,
  Order,
} from "@order/types/order";
import { Data } from "@order/types";
import { toGrpc } from "@order/lib/transformer";

export const GetOrderByDelivery = async (
  { request }: Data<GetOrderByDeliveryRequest>,
  callback: (err: any, response: Order | null) => void
) => {
  try {
    const { id } = request;
    const order = await prisma.order.findFirstOrThrow({
      where: { delivery_id: id },
      include: { basket_snapshot: true, user: true },
    });
    callback(null, toGrpc(order));
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
