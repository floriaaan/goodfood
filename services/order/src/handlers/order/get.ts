import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import { GetOrderRequest, Order } from "@order/types/order";
import { Data } from "@order/types";
import { toGrpc } from "@order/lib/transformer";

export const GetOrder = async (
  { request }: Data<GetOrderRequest>,
  callback: (err: any, response: Order | null) => void
) => {
  try {
    const { id } = request;
    const order = await prisma.order.findUniqueOrThrow({
      where: { id },
      include: { basket_snapshot: true, user: true },
    });
    callback(null, toGrpc(order));
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
