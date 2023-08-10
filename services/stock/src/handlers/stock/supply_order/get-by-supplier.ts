import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import {
  GetSupplyOrdersBySupplierRequest,
  GetSupplyOrdersBySupplierResponse,
} from "@stock/types/stock";
import { Data } from "@stock/types";

export const GetSupplyOrdersBySupplier = async (
  { request }: Data<GetSupplyOrdersBySupplierRequest>,
  callback: (
    err: any,
    response: GetSupplyOrdersBySupplierResponse | null
  ) => void
) => {
  try {
    const { supplier_id } = request;
    const supply_orders = await prisma.supplyOrder.findMany({
      where: { supplier_id },
      include: {
        supplier: true,
        ingredient_restaurant: {
          include: {
            ingredient: true,
            supplier: true,
          },
        },
      },
    });
    callback(null, { supply_orders });
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
