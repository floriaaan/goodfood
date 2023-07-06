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
        [key: string]: { count: number; price: number };
      };

    const total = Object.values(json).reduce((acc, cur) => acc + cur.price, 0);

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
            total,
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
