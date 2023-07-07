import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import {
  GetDeliveryTypeRepartitionRequest,
  GetDeliveryTypeRepartitionResponse,
} from "@order/types/reporting";
import { Data } from "@order/types";
import { fromInterval } from "@order/lib/date";
import { DeliveryType } from "@prisma/client";

export const GetDeliveryTypeRepartition = async (
  { request }: Data<GetDeliveryTypeRepartitionRequest>,
  callback: (
    err: any,
    response: GetDeliveryTypeRepartitionResponse | null
  ) => void
) => {
  try {
    const { date, restaurant_id, interval } = request;
    const { start, end } = fromInterval(interval, date);

    const orders = await prisma.order.findMany({
      where: { restaurant_id, created_at: { gte: start, lte: end } },
    });

    const delivery = orders.filter(
      (o) => o.delivery_type === DeliveryType.DELIVERY
    ).length;
    const takeaway = orders.filter(
      (o) => o.delivery_type === DeliveryType.TAKEAWAY
    ).length;

    callback(null, { delivery, takeaway });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
