import { prisma } from "@stock/lib/prisma";
import { log } from "@stock/lib/log";
import {
  DeleteIngredientRequest,
  DeleteIngredientResponse,
} from "@stock/types/stock";
import { Data } from "@stock/types";

export const DeleteIngredient = async (
  { request }: Data<DeleteIngredientRequest>,
  callback: (err: any, response: DeleteIngredientResponse | null) => void
) => {
  try {
    const { id } = request;
    await prisma.ingredient.delete({ where: { id } });
    callback(null, { success: true });
  } catch (error) {
    log.error(error);
    callback(error, { success: false });
  }
};
