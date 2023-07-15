import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import {
  ExtendedOrder,
  GetOrdersByStatusRequest,
  GetOrdersByStatusResponse,
} from "@order/types/order";
import { Data } from "@order/types";
import { toGrpc } from "@order/lib/transformer";

export const GetOrdersByStatus = async (
  { request }: Data<GetOrdersByStatusRequest>,
  callback: (err: any, response: GetOrdersByStatusResponse | null) => void
) => {
  try {
    const { status } = request;
    const orders = (await prisma.order.findMany({
      where: { status },
      include: { basket_snapshot: true, user: true },
    })) as ExtendedOrder[];
    callback(null, { orders: orders.map(toGrpc) as ExtendedOrder[] });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
