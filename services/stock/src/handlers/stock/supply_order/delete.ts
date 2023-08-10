import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import {
  DeleteSupplyOrderRequest,
  DeleteSupplyOrderResponse,
} from "@stock/types/stock";
import { Data } from "@stock/types";

export const DeleteSupplyOrder = async (
  { request }: Data<DeleteSupplyOrderRequest>,
  callback: (err: any, response: DeleteSupplyOrderResponse | null) => void
) => {
  try {
    const { id } = request;
    await prisma.supplyOrder.delete({ where: { id } });
    callback(null, { success: true });
  } catch (error) {
    log.error(error);
    callback(error, { success: false });
  }
};
