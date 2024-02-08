import { log } from "@stock/lib/log";
import { prisma } from "@stock/lib/prisma";
import { Data } from "@stock/types";
import { CreateSupplyOrderRequest, SupplyOrder } from "@stock/types/stock";

export const CreateSupplyOrder = async (
  { request }: Data<CreateSupplyOrderRequest>,
  callback: (err: any, response: SupplyOrder | null) => void
) => {
  try {
    const { ingredient_restaurant_id, quantity, supplier_id } = request;

    const { unit_price } = await prisma.ingredientRestaurant.findUniqueOrThrow({
      where: { id: ingredient_restaurant_id },
      select: { unit_price: true },
    });

    await prisma.ingredientRestaurant.update({
      where: { id: ingredient_restaurant_id },
      data: { quantity: { increment: quantity } },
    });

    const supply_order = await prisma.supplyOrder.create({
      data: { ingredient_restaurant_id, quantity, supplier_id, unit_price },
      include: {
        supplier: true,
        ingredient_restaurant: {
          include: { ingredient: true, supplier: true },
        },
      },
    });

    callback(null, supply_order);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
