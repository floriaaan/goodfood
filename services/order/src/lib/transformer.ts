import { toStruct } from "@order/lib/struct";
import { Basket, Order, UserMinimum } from "@prisma/client";

export const toGrpc = (
  order: Order & {
    user: UserMinimum;
    basket_snapshot: Basket;
  }
) => {
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
