import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import { UpdateSupplyOrderRequest, SupplyOrder } from "@stock/types/stock";
import { Data } from "@stock/types";

export const UpdateSupplyOrder = async (
  { request }: Data<UpdateSupplyOrderRequest>,
  callback: (err: any, response: SupplyOrder | null) => void
) => {
  try {
    const { id, ingredient_restaurant_id, quantity, supplier_id, unit_price } =
      request;
    const supply_order = await prisma.supplyOrder.update({
      where: { id },
      data: { ingredient_restaurant_id, quantity, supplier_id, unit_price },
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
