import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import {
  GetTop5SellingProductsRequest,
  GetTop5SellingProductsResponse,
  ProductCount,
} from "@order/types/reporting";
import { Data } from "@order/types";
import { fromInterval } from "@order/lib/date";

export const GetTop5SellingProducts = async (
  { request }: Data<GetTop5SellingProductsRequest>,
  callback: (err: any, response: GetTop5SellingProductsResponse | null) => void
) => {
  try {
    const { date, restaurant_id, interval } = request;
    const { start, end } = fromInterval(interval, date);

    const orders = await prisma.order.findMany({
      where: { restaurant_id, created_at: { gte: start, lte: end } },
      include: { basket_snapshot: true },
    });

    const products_count = orders
      .reduce((acc, order) => {
        const { json } = order.basket_snapshot as unknown as {
          json: { [key: string]: { count: number; price: number } };
        };
        Object.entries(json).forEach(([product_id, { count }]) => {
          const product = acc.find((p) => p.id === product_id);
          if (product) {
            product.count += count;
            acc.filter((p) => p.id !== product_id).push(product);
          } else acc.push({ id: product_id, count });
        });
        return acc;
      }, [] as ProductCount[])
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    callback(null, {
      products_count,
    });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
