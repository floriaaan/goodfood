import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import {
  DeleteIngredientRestaurantRequest,
  DeleteIngredientRestaurantResponse,
} from "@stock/types/stock";
import { Data } from "@stock/types";

export const DeleteIngredientRestaurant = async (
  { request }: Data<DeleteIngredientRestaurantRequest>,
  callback: (
    err: any,
    response: DeleteIngredientRestaurantResponse | null
  ) => void
) => {
  try {
    const { id } = request;
    await prisma.ingredientRestaurant.delete({ where: { id } });
    callback(null, { success: true });
  } catch (error) {
    log.error(error);
    callback(error, { success: false });
  }
};
