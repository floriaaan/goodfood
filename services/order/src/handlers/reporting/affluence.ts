import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import {
  GetOrdersAffluenceRequest,
  GetOrdersAffluenceResponse,
} from "@order/types/reporting";
import { Data } from "@order/types";

export const GetOrdersAffluence = async (
  { request }: Data<GetOrdersAffluenceRequest>,
  callback: (err: any, response: GetOrdersAffluenceResponse | null) => void
) => {
  try {
    const { date, restaurant_id } = request;
    const start = new Date(date + " 00:00:00");
    const end = new Date(date + " 23:59:59");
    const orders = await prisma.order.findMany({
      where: {
        created_at: { gte: start, lte: end },
        restaurant_id,
      },
    });
    const orders_per_hour = Array.from({ length: 24 }, (_, i) => i).map(
      (hour) => {
        const start = new Date(date + ` ${hour}:00:00`);
        const end = new Date(date + ` ${hour}:59:59`);
        const orders_in_hours = orders.filter(
          (order) => order.created_at >= start && order.created_at <= end
        );
        return orders_in_hours.length;
      }
    );

    callback(null, {
      average:
        orders_per_hour.reduce((a, b) => a + b, 0) / orders_per_hour.length,
      total: orders.length,
      min: Math.min(...orders_per_hour),
      max: Math.max(...orders_per_hour),
      orders_per_hour,
    });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
