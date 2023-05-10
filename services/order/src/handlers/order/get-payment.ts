import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import { GetOrderByPaymentRequest, Order } from "@order/types/order";
import { Data } from "@order/types";
import { toGrpc } from "@order/lib/transformer";

export const GetOrderByPayment = async (
  { request }: Data<GetOrderByPaymentRequest>,
  callback: (err: any, response: Order | null) => void
) => {
  try {
    const { id } = request;
    const order = await prisma.order.findFirstOrThrow({
      where: { payment_id: id },
      include: { basket_snapshot: true, user: true },
    });
    callback(null, toGrpc(order));
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
