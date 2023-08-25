import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import { CreateOrderRequest, Order } from "@order/types/order";
import { Data } from "@order/types";
import { parseStruct } from "@order/lib/struct";
import { toGrpc } from "@order/lib/transformer";

export const CreateOrder = async (
  { request }: Data<CreateOrderRequest>,
  callback: (err: any, response: Order | null) => void
) => {
  try {
    const {
      basket_snapshot,
      delivery_id,
      delivery_type,
      payment_id,
      user,
      restaurant_id,
    } = request;

    const json = // (parseStruct(basket_snapshot.json) ||
      JSON.parse(basket_snapshot.string) as {
        user_id: number;
        products_ids: string[]; // todo: change to product minimum ({count: number, id: string, price: number}}})
        restaurant_id: string;
    };

    const user_in_db = await prisma.userMinimum.findFirst({
      where: { email: user.email },
    });
    const order = await prisma.order.create({
      data: {
        delivery_id,
        delivery_type,
        payment_id,
        user: user_in_db
          ? { connect: { id: user_in_db.id } }
          : { create: { ...user, id: undefined } },
        basket_snapshot: {
          create: {
            string: basket_snapshot.string,
            json,
            // todo: get total from basket_snapshot from product minimum
            total: 0
          },
        },
        restaurant_id,
      },
      include: { basket_snapshot: true, user: true },
    });

    callback(null, toGrpc(order));
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
