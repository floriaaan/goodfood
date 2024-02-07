import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import { toGrpc } from "@order/lib/transformer";
import { Data } from "@order/types";
import { ExtendedOrder, GetOrdersByRestaurantRequest, GetOrdersByRestaurantResponse } from "@order/types/order";

export const GetOrdersByRestaurant = async (
  { request }: Data<GetOrdersByRestaurantRequest>,
  callback: (err: any, response: GetOrdersByRestaurantResponse | null) => void
) => {
  try {
    const { id } = request;
    const orders = (await prisma.order.findMany({
      where: { restaurant_id: id },
      include: { basket_snapshot: true, user: true },
    })) as ExtendedOrder[];
    callback(null, { orders: orders.map(toGrpc) as ExtendedOrder[] });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
