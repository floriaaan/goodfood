import { toStruct } from "@order/lib/struct";
import { ExtendedOrder } from "@order/types/order";

export const toGrpc = (order: ExtendedOrder) => {
  if(!order) return null
  return {
    id: order.id,
    payment_id: order.payment_id,
    delivery_id: order.delivery_id,
    user: order.user,
    basket_snapshot: {
      string: order.basket_snapshot.string,
      json: toStruct(order.basket_snapshot.json),
    },
    status: order.status,
  };
};
