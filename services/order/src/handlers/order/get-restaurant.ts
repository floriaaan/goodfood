import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import {
  ExtendedOrder,
  GetOrdersByRestaurantRequest,
  GetOrdersByRestaurantResponse,
} from "@order/types/order";
import { Data } from "@order/types";
import { toGrpc } from "@order/lib/transformer";

export const GetOrdersByRestaurant = async (
  { request }: Data<GetOrdersByRestaurantRequest>,
  callback: (err: any, response: GetOrdersByRestaurantResponse | null) => void
) => {
  try {
    const { id } = request;
    const orders = (await prisma.order.findMany({
      where: { restaurant_id : id },
      include: { basket_snapshot: true, user: true },
    })) as ExtendedOrder[];
    callback(null, { orders: orders.map(toGrpc) as ExtendedOrder[] });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
