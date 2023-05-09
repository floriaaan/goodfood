import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import { GetOrderRequest, Order } from "@order/types/order";
import { Data } from "@order/types";

export const GetOrder = async (
  { request }: Data<GetOrderRequest>,
  callback: (err: any, response: Order | null) => void
) => {
  log.debug("request received at GetOrder handler\n", request);
  try {
    const { id } = request;
    const order = await prisma.order.findUniqueOrThrow({
      where: { id },
      include: { basket_snapshot: true, user: true },
    });
    callback(null, order);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
