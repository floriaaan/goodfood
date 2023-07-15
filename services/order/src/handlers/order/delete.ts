import { prisma } from "@order/lib/prisma";
import { log } from "@order/lib/log";
import { DeleteOrderRequest, DeleteOrderResponse } from "@order/types/order";
import { Data } from "@order/types";

export const DeleteOrder = async (
  { request }: Data<DeleteOrderRequest>,
  callback: (err: any, response: DeleteOrderResponse | null) => void
) => {
  try {
    const { id } = request;
    const order = await prisma.order.delete({
      where: { id },
    });
    callback(null, { id: order.id });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
