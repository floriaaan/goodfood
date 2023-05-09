import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import { CreateOrderRequest, Order } from "@order/types/order";
import { Data } from "@order/types";

export const CreateOrder = async (
  { request }: Data<CreateOrderRequest>,
  callback: (err: any, response: Order | null) => void
) => {
  log.debug("request received at CreateOrder handler\n", request);
  try {
    const { basket_snapshot, delivery_id, payment_id, user } = request;

    // todo: calculate total from basket_snapshot
    const total = 0; // basket_snapshot.reduce;

    const order = await prisma.order.create({
      data: {
        delivery_id,
        payment_id,
        user: { connectOrCreate: { where: { id: user.id }, create: user } },
        basket_snapshot: {
          create: { json: basket_snapshot.json, total },
        },
      },
      include: { basket_snapshot: true, user: true },
    });

    console.log("order", order)
    callback(null, order);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
