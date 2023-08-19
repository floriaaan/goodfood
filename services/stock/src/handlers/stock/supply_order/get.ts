import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import { GetSupplyOrderRequest, SupplyOrder } from "@stock/types/stock";
import { Data } from "@stock/types";

export const GetSupplyOrder = async (
  { request }: Data<GetSupplyOrderRequest>,
  callback: (err: any, response: SupplyOrder | null) => void
) => {
  try {
    const { id } = request;
    const supply_order = await prisma.supplyOrder.findUniqueOrThrow({
      where: { id },
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
    callback(null, supply_order);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
