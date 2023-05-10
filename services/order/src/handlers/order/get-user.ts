import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import {
  ExtendedOrder,
  GetOrdersByUserRequest,
  GetOrdersByUserResponse,
} from "@order/types/order";
import { Data } from "@order/types";
import { toGrpc } from "@order/lib/transformer";

export const GetOrdersByUser = async (
  { request }: Data<GetOrdersByUserRequest>,
  callback: (err: any, response: GetOrdersByUserResponse | null) => void
) => {
  try {
    const { id } = request;
    const orders = (await prisma.order.findMany({
      where: { user_id: id },
      include: { basket_snapshot: true, user: true },
    })) as ExtendedOrder[];
    callback(null, { orders: orders.map(toGrpc) as ExtendedOrder[] });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
